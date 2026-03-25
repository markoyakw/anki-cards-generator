import {
    LEVEL_OF_LANGUAGE_OPTIONS,
    NATIVE_LANGUAGE_OPTIONS,
    type TFormValues,
    type TTargetLanguageValue,
} from "../constants/mainForm"

const getNextLanguageLevel = (currentLevel: string): string | null => {
    const currentLevelIndex = LEVEL_OF_LANGUAGE_OPTIONS.findIndex(el => el.value === currentLevel)
    if (currentLevelIndex === -1) throw new Error("Unknown current language level value provided")
    return LEVEL_OF_LANGUAGE_OPTIONS[currentLevelIndex + 1]?.value ?? null
}

const OUTPUT_FORMAT = `
Output Format:
Return only a JSON array of objects. No markdown, no code blocks, no comments.
Each object must have exactly these fields:
{
  "wordInNativeLanguage": string,
  "clue": string,
  "wordInTargetLanguage": string,
  "additionalInformation": string,
  "useExampleInNativeLanguage1": string,
  "useExampleInNativeLanguage2": string,
  "useExampleInNativeLanguage3": string,
  "useExampleInTargetLanguage1": string,
  "useExampleInTargetLanguage2": string,
  "useExampleInTargetLanguage3": string
}
If a field can't be filled, use a single space " ".
Do not skip any fields.`

const getEnglishPrompt = (
    nativeLanguage: string,
    languageLevels: string
) => `
You are a world-class Anki flashcard creator that helps students create 
flashcards that help them remember new words and phrases that sound naturally, 
like from a native speaker. You will be given a list of English words and 
phrases, sometimes with context and rough meaning (or sometimes in ${nativeLanguage}, 
in that case, translate it to English). Cards should include all given in 
${nativeLanguage} meanings on the ${nativeLanguage} side. Use your own knowledge of the concept, 
ideas, or facts to flesh out any additional details, while keeping everything 
inside the given framework.
Make a ${nativeLanguage}-English card per given English word/phrase. If there are mistakes 
like misspelling, wrong usage etc., fix it and use fixed version as basis for output.
Keep the phrases or words roughly in the same order as given.

Field rules:
- "wordInTargetLanguage": English word/phrase. Only proper nouns start with capital letter. If irregular verb, add all 3 forms separated by "-".
- "wordInNativeLanguage": Translation in ${nativeLanguage}. Include all given meanings.
- "clue": Context clue in ${nativeLanguage}.
- "additionalInformation": Additional info in ${nativeLanguage} (informal usage, rude connotation, no plural form, etc.). Single space if not applicable.
- "useExampleInTargetLanguage1/2/3": Three ${languageLevels} level English example sentences. One must be in past simple or present perfect if natural. Highlight the word with <span style='color: var(--highlight-in-example-color)'></span>.
- "useExampleInNativeLanguage1/2/3": Each example translated to ${nativeLanguage} with the same highlight.
${OUTPUT_FORMAT}

WORDS TO PROCESS:`

const getGermanPrompt = (
    nativeLanguage: string,
    languageLevels: string
) => `
You are a world-class Anki flashcard creator that helps students create 
flashcards that help them remember new words and phrases that sound naturally, 
like from a native speaker. You will be given a list of German words and phrases, 
sometimes with context and rough meaning. Cards should include all given in 
${nativeLanguage} meanings on the ${nativeLanguage} side. Use your own knowledge of the concept, 
ideas, or facts to flesh out any additional details, while keeping everything 
inside the given framework.
Make a ${nativeLanguage}-German card per given German word/phrase. If there are mistakes 
like wrong article, misspelling, wrong usage etc., fix it and use fixed version as basis for output.
Keep the phrases or words roughly in the same order as given.

Field rules:
- "wordInTargetLanguage": German word/phrase. No word should be capitalised, if it's not always capitalised in this context, even if it's a start of the sentence. Nouns: always with definite article, capitalized, singular - plural (e.g. "der Schuh - Schuhe"). Use "keine Pluralform" / "kein Singular" if form doesn't exist. Verbs: infinitive - Perfekt - er/sie/es form (only if irregular) separated by "-". Prepositions that come with the word must be included.
- "wordInNativeLanguage": Translation in ${nativeLanguage}. Include all given meanings.
- "clue": Context clue in ${nativeLanguage}.
- "additionalInformation": Additional info in ${nativeLanguage} (informal, rude, N-Deklination with Akkusativ/Genitiv forms, etc.). Single space if not applicable.
- "useExampleInTargetLanguage1/2/3": Three ${languageLevels} level German example sentences. One must be in Perfekt if natural. Highlight the word with <span style='color: var(--highlight-in-example-color)'></span>. Mix articles and cases (Nominativ, Akkusativ, Dativ).
- "useExampleInNativeLanguage1/2/3": Each example translated to ${nativeLanguage} with the same highlight.
${OUTPUT_FORMAT}

WORDS TO PROCESS:`

const PROMPT_BUILDERS: Partial<Record<TTargetLanguageValue, (native: string, levels: string) => string>> = {
    'en-US': getEnglishPrompt,
    'de': getGermanPrompt,
}

const buildPrompt = (data: TFormValues): string => {
    const nativeLanguageValue = data["native-language-select"]
    const targetLanguageValue = data["target-language-select"]
    const levelOfLanguageValue = data["level-of-language-select"]
    const wordsToProcess = data["prompt-words-to-process"]

    const nativeLanguage = NATIVE_LANGUAGE_OPTIONS.find(l => l.value === nativeLanguageValue)?.text
    const levelOfLanguage = LEVEL_OF_LANGUAGE_OPTIONS.find(l => l.value === levelOfLanguageValue)?.text

    if (!nativeLanguage || !levelOfLanguage) {
        throw new Error("NativeLanguage or levelOfLanguage does not have a corresponding text field")
    }

    const nextLevel = getNextLanguageLevel(levelOfLanguage)
    const languageLevels = `${levelOfLanguage}${nextLevel ? ` to ${nextLevel}` : ''}`

    const buildPromptForLanguage = PROMPT_BUILDERS[targetLanguageValue]
    if (!buildPromptForLanguage) throw new Error(`No prompt builder for language: ${targetLanguageValue}`)

    return buildPromptForLanguage(nativeLanguage, languageLevels) + "\n" + wordsToProcess
}

export default buildPrompt