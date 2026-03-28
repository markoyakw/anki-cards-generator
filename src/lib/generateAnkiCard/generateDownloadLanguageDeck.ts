import getAnkiCardTemplate from "./getAnkiCardTemplate"
import languageCardFrontHTML from "./languageCardFront.html?raw"
import languageCardBack from "./languageCardBack.html?raw"
import type { TLanguageCard } from "../../types/languageCard"
import type { TTargetLanguageValue } from "../../constants/mainForm"

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

const generateDownloadLanguageDeck = (language: TTargetLanguageValue, ...getAnkiCardTemplateParams: Parameters<ReturnType<typeof getAnkiCardTemplate>>) => {

    const downloadDeck = getAnkiCardTemplate({
        modelName: 'Language card',
        fields,
        templates: [{
            name: 'Native to Target',
            qfmt: languageCardFrontHTML,
            afmt: languageCardBack,
        }],
        ttsFields: [
            { name: "wordInTargetLanguage", lang: language },
            { name: "useExampleInTargetLanguage1", lang: language },
            { name: "useExampleInTargetLanguage2", lang: language },
            { name: "useExampleInTargetLanguage3", lang: language }
        ]
    })

    return downloadDeck(...getAnkiCardTemplateParams)
}

export default generateDownloadLanguageDeck