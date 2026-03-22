import initSqlJs, { type Database } from 'sql.js'
import JSZip from 'jszip'
import type { TTargetLanguageValue } from '../../constants/mainForm'

interface AnkiTemplate {
    name: string
    qfmt: string
    afmt: string
}

interface AnkiModelConfig<TFields extends string = string> {
    modelName: string
    fields: TFields[]
    templates: AnkiTemplate[]
    css?: string
    ttsFields?: { name: TFields, lang: TTargetLanguageValue }[]
}

async function fetchTts(text: string, lang = 'de'): Promise<ArrayBuffer> {
    const response = await fetch(`/api/tts?text=${encodeURIComponent(text)}&lang=${lang}`)
    const buffer = await response.arrayBuffer()
    return buffer
}

function getAnkiCardTemplate<TFields extends string>(config: AnkiModelConfig<TFields>) {
    return async function download(deckName: string, cards: Record<TFields, string>[]): Promise<void> {
        const SQL = await initSqlJs({ locateFile: () => `/sql-wasm.wasm` })
        const db: Database = new SQL.Database()
        const now = Math.floor(Date.now() / 1000)
        const deckId = Date.now()
        const modelId = Date.now()

        db.run(`CREATE TABLE col (id INTEGER PRIMARY KEY, crt INTEGER, mod INTEGER, scm INTEGER, ver INTEGER, dty INTEGER, usn INTEGER, ls INTEGER, conf TEXT, models TEXT, decks TEXT, dconf TEXT, tags TEXT)`)
        db.run(`CREATE TABLE notes (id INTEGER PRIMARY KEY, guid TEXT, mid INTEGER, mod INTEGER, usn INTEGER, tags TEXT, flds TEXT, sfld TEXT, csum INTEGER, flags INTEGER, data TEXT)`)
        db.run(`CREATE TABLE cards (id INTEGER PRIMARY KEY, nid INTEGER, did INTEGER, ord INTEGER, mod INTEGER, usn INTEGER, type INTEGER, queue INTEGER, due INTEGER, ivl INTEGER, factor INTEGER, reps INTEGER, lapses INTEGER, left INTEGER, odue INTEGER, odid INTEGER, flags INTEGER, data TEXT)`)
        db.run(`CREATE TABLE graves (usn INTEGER NOT NULL, oid INTEGER NOT NULL, type INTEGER NOT NULL)`)
        db.run(`CREATE TABLE revlog (id INTEGER PRIMARY KEY, cid INTEGER NOT NULL, usn INTEGER NOT NULL, ease INTEGER NOT NULL, ivl INTEGER NOT NULL, lastIvl INTEGER NOT NULL, factor INTEGER NOT NULL, time INTEGER NOT NULL, type INTEGER NOT NULL)`)

        const mediaMap: Record<string, string> = {}
        const audioFiles: { name: string, data: ArrayBuffer }[] = []

        const cardsAsArrays: string[][] = cards.map(card =>
            config.fields.map(fieldName => card[fieldName] ?? '')
        )

        // generate audio if ttsField is assigned
        if (config.ttsFields && config.ttsFields.length > 0) {
            const indexedFields = config.ttsFields.map(field => ({
                index: config.fields.indexOf(field.name),
                lang: field.lang
            }))

            let mediaCounter = 0

            for (let i = 0; i < cardsAsArrays.length; i++) {
                for (const { index, lang } of indexedFields) {
                    const text = cardsAsArrays[i][index]
                    if (!text) continue
                    const filename = `${mediaCounter}.mp3`
                    const zipFilename = `${mediaCounter}`
                    try {
                        const audio = await fetchTts(text, lang)
                        audioFiles.push({ name: zipFilename, data: audio })
                        mediaMap[String(mediaCounter)] = filename
                        cardsAsArrays[i][index] = `${text} [sound:${filename}]`
                        mediaCounter++
                    } catch (e) {
                        console.warn(`TTS failed for "${text}"`, e)
                    }
                }
            }
        }

        const decks = JSON.stringify({
            [deckId]: {
                id: deckId, name: deckName, conf: 1, desc: '', dyn: 0,
                collapsed: false, browserCollapsed: false, extendNew: 0, extendRev: 0,
                newToday: [0, 0], revToday: [0, 0], lrnToday: [0, 0], timeToday: [0, 0],
                mod: now, usn: -1
            }
        })

        const models = JSON.stringify({
            [modelId]: {
                id: modelId, name: config.modelName, type: 0, mod: now, usn: -1,
                sortf: 0, did: deckId,
                flds: config.fields.map((f, ord) => ({
                    name: f, ord, sticky: false, rtl: false, font: 'Arial', size: 20,
                })),
                tmpls: config.templates.map((t, ord) => ({
                    name: t.name, ord, qfmt: t.qfmt, afmt: t.afmt,
                    bqfmt: '', bafmt: '', did: null, bfont: '', bsize: 0
                })),
                css: config.css ?? '.card { font-family: Arial; font-size: 20px; text-align: center; }',
                latexPre: '', latexPost: '', req: [[0, 'any', [0]]]
            }
        })

        db.run(`INSERT INTO col VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
            1, now, now, now, 11, 0, -1, 0, '{}', models, decks, '{}', '{}'
        ])

        cardsAsArrays.forEach((fields, i) => {
            const flds = fields.join('\x1f')
            const guid = Math.random().toString(36).substring(2, 12)
            db.run(`INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
                [i + 1, guid, modelId, now, -1, '', flds, fields[0] ?? '', 0, 0, ''])
            db.run(`INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [i + 1, i + 1, deckId, 0, now, -1, 0, 0, i, 0, 2500, 0, 0, 0, 0, 0, 0, ''])
        })

        const dbBytes = db.export()

        const zip = new JSZip()
        zip.file('collection.anki2', dbBytes)
        zip.file('media', JSON.stringify(mediaMap))
        audioFiles.forEach(f => zip.file(f.name, f.data))

        const blob = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${deckName}.apkg`
        a.click()
        URL.revokeObjectURL(url)
        db.close()
    }
}

export default getAnkiCardTemplate