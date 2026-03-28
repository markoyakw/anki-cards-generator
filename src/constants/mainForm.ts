export const NATIVE_LANGUAGE_OPTIONS = [
    { value: "", text: "" },
    { value: "ua", text: "ukrainian" },
    { value: "ru", text: "russian" }
] as const
export type TNativeLanguageOption = typeof NATIVE_LANGUAGE_OPTIONS[number]
export type TNativeLanguageValue = Exclude<TNativeLanguageOption['value'], "">

export const TARGET_LANGUAGE_OPTIONS = [
    { value: "", text: "" },
    { value: "en-US", text: "english" },
    { value: "de", text: "german" }
] as const
export type TTargetLanguageOption = typeof TARGET_LANGUAGE_OPTIONS[number]
export type TTargetLanguageValue = Exclude<TTargetLanguageOption['value'], "">

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
export type TLevelOfLanguageValue = Exclude<TLevelOfLanguageOption["value"], "">

export type TFormValues = {
    "native-language-select": TNativeLanguageValue
    "target-language-select": TTargetLanguageValue
    "level-of-language-select": TLevelOfLanguageValue
    "prompt-words-to-process": string
    "new-api-key": string
}