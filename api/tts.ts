export default async function handler(req: any, res: any) {
    const { text, lang = 'de' } = req.query

    if (!text) return res.status(400).json({ error: 'text is required' })

    // Этот endpoint используют расширения Chrome — меньше блокировок
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=gtx&ttsspeed=0.8`

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://translate.googleapis.com/',
            'Accept-Language': 'de,en;q=0.9',
        }
    })

    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    // Проверяем что это MP3 а не HTML
    if (bytes[0] === 60) { // '<' — HTML страница
        const text = new TextDecoder().decode(buffer)
        console.error('Got HTML instead of audio:', text.substring(0, 200))
        return res.status(500).json({ error: 'Google blocked the request' })
    }

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 's-maxage=86400')
    res.send(Buffer.from(buffer))
}