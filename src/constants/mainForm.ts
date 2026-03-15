export const NATIVE_LANGUAGE_OPTIONS = [
    { value: "", text: "" },
    { value: "ua", text: "ukrainian" },
    { value: "ru", text: "russian" }
] as const
export type TNativeLanguageOption = typeof NATIVE_LANGUAGE_OPTIONS[number]
export type TNativeLanguageValue = typeof NATIVE_LANGUAGE_OPTIONS[number]['value']

export const LANGUAGE_TO_LEARN_OPTIONS = [
    { value: "", text: "" },
    { value: "en", text: "english" },
    { value: "ge", text: "german" }
] as const
export type TLanguageToLearnOption = typeof LANGUAGE_TO_LEARN_OPTIONS[number]
export type TLanguageToLearnValue = typeof LANGUAGE_TO_LEARN_OPTIONS[number]['value']

export const LEVEL_OF_LANGUAGE_OPTIONS = [
    { value: "", text: "" },
    { value: "a1", text: "a1" },
    { value: "a2", text: "a2" },
    { value: "b1", text: "b1" },
    { value: "b2", text: "b2" },
    { value: "c1", text: "c1" },
    { value: "c2", text: "c2" },
    { value: "c2+", text: "c2+" },

] as const

export type TLevelOfLanguageOption = typeof LEVEL_OF_LANGUAGE_OPTIONS[number]
export type TLevelOfLanguageValue = typeof LEVEL_OF_LANGUAGE_OPTIONS[number]["value"]

export type TFormValues = {
    "native-language-select": TNativeLanguageValue
    "language-to-learn-select": TLanguageToLearnValue
    "level-of-language-select": TLevelOfLanguageValue
    "prompt-words-to-process": string
    "new-api-key": string
}