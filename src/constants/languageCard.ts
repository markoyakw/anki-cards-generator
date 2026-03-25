import type { TLanguageCard } from "../types/languageCard";

export const LANGUAGE_CARD_FIELD_ORDER: (keyof TLanguageCard)[] = [
    'wordInTargetLanguage',
    'wordInNativeLanguage',
    'clue',
    'additionalInformation',
    'useExampleInNativeLanguage1',
    'useExampleInNativeLanguage2',
    'useExampleInNativeLanguage3',
    'useExampleInTargetLanguage1',
    'useExampleInTargetLanguage2',
    'useExampleInTargetLanguage3',
]
