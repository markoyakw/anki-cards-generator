import getAnkiCardTemplate from "./getAnkiCardTemplate"
import languageCardFrontHTML from "./languageCardFront.html?raw"
import languageCardBack from "./languageCardBack.html?raw"


const generateDownloadLanguageDeck = getAnkiCardTemplate({
    deckName: 'Deutsch',
    modelName: 'Deutsch Wörter',
    fields: [
        { name: 'Das Wort auf Russisch' },
        { name: 'Der Hinweis' },
        { name: 'Das Wort auf Deutsch' },
        { name: 'die Verwendungsbeispiele auf Russisch' },
        { name: 'Zusätzliche Information' },
        { name: 'das Verwendungsbeispiel auf Deutsch 1' },
        { name: 'das Verwendungsbeispiel auf Deutsch 2' },
        { name: 'das Verwendungsbeispiel auf Deutsch 3' },
    ],
    templates: [{
        name: 'Card 1',
        qfmt: languageCardFrontHTML,
        afmt: languageCardBack,
    }],
})

export default generateDownloadLanguageDeck