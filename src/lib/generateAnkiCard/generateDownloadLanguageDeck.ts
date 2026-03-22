import getAnkiCardTemplate from "./getAnkiCardTemplate"
import languageCardFrontHTML from "./languageCardFront.html?raw"
import languageCardBack from "./languageCardBack.html?raw"
import type { TLanguageCard } from "../../types/languageCard"

const fields: (keyof TLanguageCard)[] = [
    "wordInNativeLanguage",
    "wordInTargetLanguage",
    "clue",
    "additionalInformation",
    
    "useExampleInNativeLanguage1",
    "useExampleInNativeLanguage2",
    "useExampleInNativeLanguage3",

    "useExampleInTargetLanguage1",
    "useExampleInTargetLanguage2",
    "useExampleInTargetLanguage3",
]

const generateDownloadLanguageDeck = getAnkiCardTemplate({
    modelName: 'Language card',
    fields,
    templates: [{
        name: 'Native to Target',
        qfmt: languageCardFrontHTML,
        afmt: languageCardBack,
    }],
    ttsFields: [
        { name: "wordInTargetLanguage", lang: 'de' },
        { name: "useExampleInTargetLanguage1", lang: 'de' },
        { name: "useExampleInTargetLanguage2", lang: 'de' },
        { name: "useExampleInTargetLanguage3", lang: 'de' }
    ]
})

export default generateDownloadLanguageDeck