import { LEVEL_OF_LANGUAGE_OPTIONS, NATIVE_LANGUAGE_OPTIONS, type TFormValues, type TLanguageToLearnValue, type TNativeLanguageOption } from "../constants/mainForm"

const getNextLanguageLevel = (currentLevel: string): string | null => {
    const currentLevelId = LEVEL_OF_LANGUAGE_OPTIONS.findIndex(lvlElement => lvlElement.value === currentLevel)
    if (!currentLevelId) throw new Error("Unknown current language level value provided")
    const nextLevel = LEVEL_OF_LANGUAGE_OPTIONS[currentLevelId + 1]
    if (!nextLevel) return null
    return nextLevel.value
}

const getPromptWithoutWordsToProcess = (
    nativeLanguageText: TNativeLanguageOption["text"],
    languageToLearnValue: TLanguageToLearnValue,
    languageLevelsForExampleSentences: string
) => {

    if (languageToLearnValue === "en") return `
    You are a world-class Anki flashcard creator that helps students create 
    flashcards that help them remember new words and phrases that sound naturally, 
    like from a native speaker. You will be given a list of English words and 
    phrases, sometimes with context and rough meaning (or sometimes in ${nativeLanguageText}, 
    in that case, translate it to English) . Cards should include all given in 
    ${nativeLanguageText} meanings on the ${nativeLanguageText} side. And use your own knowledge of the concept, 
    ideas, or facts to flesh out any additional details, while keeping everything 
    inside the given framework.
    Make a ${nativeLanguageText}-English card per given English word/phrase using the list words 
    and phrases below. If there are mistakes like  misspelling, wrong usage etc., 
    fix it and use fixed version as basis for an output.
    Keep the phrases or words roughly in the same order as given.
    Output Format:
    The file will be imported into Anki. You should return only code for import, without
    \`\`\`txt or any code type or language specified.
    It will be imported straight to Anki and you will not leave any comments, 
    P.S. and text that is not related to import file. Fields should be divided with 
    pipe. You can't use a pipe inside one field. Only given below fields should be 
    divided by a field divider - pipe.
    Fields names which you will fill up accordingly:
    1: Word in English
    2: Word in ${nativeLanguageText}
    3: Clue
    4: Useful information
    5: Use example in ${nativeLanguageText}
    6: Use example in English 1
    7: Use example in English 2
    8: Use example in English 3
    If any of a fields can't be filled or should not be filled, leave a space symbol 
    here. Don't skip empty fields. Or it will crash the app.
    "Useful information" - If there is additional information about the word or a 
    phrase (for example, only used in unoficiall conversation or used in a rude way 
    or don't have a plural form, or it is an unusual one), fill this field. If not, 
    leave here a singular space symbol. If present, it should be filled in ${nativeLanguageText} 
    language, with English parts if they are needed for better understanding.
    In the field "Word in English" only proper nouns that are always capitalized 
    will start with a capital letter. All other words or phrases should start with 
    a lowercase letter. Do not forcefully change a word to a noun if it is not a 
    noun in the given context. In other fields, use capital letters with account 
    of new line, new sentence etc.
    If the Word is an Irregular Verb, add all 3 forms, separated by "-".
    "Clue" field should have a clue about a context, in which the word is used. 
    Clue must be in ${nativeLanguageText}.
    "Use example in English" 1, 2 and 3 - are separate fields and should be divided 
    using field divided, that i defined earlier. Examples of usage of the word in 
    given (if it's defined by context or stated exactly) or similar context. 
    You must generate 3 ${languageLevelsForExampleSentences} level sentence examples, one of them must be in 
    past simple or present perfect if it sounds natural and if it is something a 
    native speaker would say. In every example, the word should be highlighted with 
    html tag <span style='color: var(--highlight-in-example-color)'></span>. 
    "Use example in ${nativeLanguageText}" - All 3 of "Use example in English" sentences 
    translated to ${nativeLanguageText}, including highlight of a word. Each new example should 
    be in <li></li> tag.
    WORDS TO PROCESS:`

    if (languageToLearnValue === "ge") return `
    You are a world-class Anki flashcard creator that helps students create 
    flashcards that help them remember new words and phrases that sound naturally, 
    like from a native speaker. You will be given a list of german words and phrases, 
    sometimes with context and rough meaning. Cards should include all given in 
    ${nativeLanguageText} meanings on the ${nativeLanguageText} side. And use your own knowledge of the concept, 
    ideas, or facts to flesh out any additional details, while keeping everything 
    inside the given framework.
    Make a ${nativeLanguageText}-german card per given german word/phrase using the list words 
    and phrases below. If there are mistakes like wrong article, misspelling, wrong 
    usage etc., fix it and use fixed version as basis for an output.
    Keep the phrases or words roughly in the same order as given.
    Output Format:
    The file will be imported into Anki. The file will be imported into Anki.
    You should return only code for import, without \`\`\`txt or any code type or language specified.
    It will be imported straight to Anki and you will not leave any comments, 
    P.S. and text that is not related to import file. Fields should be divided 
    with pipe. You can't use a pipe inside one field. Only given below fields 
    should be divided by a field divider - pipe.
    Fields names which you will fill up accordingly:
    1: Das Wort auf Deutsch
    2: Das Wort auf ${nativeLanguageText}
    3: Der Hinweis
    4: Zusätzliche Information
    5: das Verwendungsbeispiel auf ${nativeLanguageText}
    6: das Verwendungsbeispiel auf Deutsch 1
    7: das Verwendungsbeispiel auf Deutsch 2
    8: das Verwendungsbeispiel auf Deutsch 3
    If any of a fields can't be filled or should not be filled, leave a space 
    symbol here. Don't skip empty fields. Or it will crash the app.
    "Zusätzliche Information" - If there is additional information about the word 
    or a phrase (for example, only used in unoficiall conversation or used in a rude 
    way or don't have a plural form), fill this field. If not, leave here a singular 
    space symbol. If present, it should be filled in ${nativeLanguageText} language, with german 
    parts if they are needed for better understanding.
    In the field "Das Wort auf Deutsch" only words that are always capitalized 
    (i.e., nouns) will start with a capital letter. All other words, including 
    articles, should start with a lowercase letter. If a word is a noun, it should 
    always have a definite article. If an indefinite article is present, change 
    it to a definite one. However, do not forcefully change a word to a noun if 
    it is not a noun in the given context. In other fields, use the capital letters 
    with account of new line, new sentence etc.
    Also, if only a noun, not a phrase is given, this field needs to include 
    singular and plural form, separated by a "-" symbol. like that: "singular - 
    plural". Plural form must be written fully but without the "die" article. 
    If any of forms is does not exist, write "kein form name" instead of a form. 
    for example: "singular - keine Pluralform"
    In a same manner, add hat/ist + perfect form to verbs. Without Präteritum 
    and separated by "-".
    If regular, perfect, plural or a singular form does not exist or its usage 
    is unique or different in meaning completely, then also add about it in a 
    "Zusätzliche Information" field.
    "Der Hinweis" field should have a clue about a context, in which the word is 
    used. Clue must be in ${nativeLanguageText} language.
    "die Verwendungsbeispiele auf Deutsch" 1, 2 and 3 - are separate fields and 
    should be divided using field divided, that i defined earlier. Examples of 
    usage of the word in given (if it's defined by context or stated exactly) or 
    similar context. You must generate 3 ${languageLevelsForExampleSentences} level sentence examples, one of 
    them must be in perfect if it sounds natural and if it something a native 
    speaker would say. In every example, the word should be highlighted with html 
    tag <span style='color: var(--highlight-in-example-color)'></span>. Also, you 
    try to mix indefinite and definite articles as well as dativ, akkusativ and 
    nominativ.
    "das Verwendungsbeispiel auf ${nativeLanguageText}" - All 3 of "das Verwendungsbeispiel 
    auf Deutsch" sentences translated to ${nativeLanguageText}, including highlight of a word. 
    Each new example should be in <li></li> tag.
    WORDS TO PROCESS:
    `
}

const buildPrompt = (
    data: TFormValues
) => {
    const nativeLanguageValue = data["native-language-select"]
    const languageToLearnValue = data["language-to-learn-select"]
    const levelOfLanguageValue = data["level-of-language-select"]
    const promptWordsToProcess = data["prompt-words-to-process"]

    const nativeLanguage = NATIVE_LANGUAGE_OPTIONS.find((nativeLanguage) => nativeLanguage.value === nativeLanguageValue)?.text
    const levelOfLanguage = LEVEL_OF_LANGUAGE_OPTIONS.find((levelOfLanguage) => levelOfLanguage.value === levelOfLanguageValue)?.text

    if (!nativeLanguage || !levelOfLanguage) throw new Error("NativeLanguage or levelOfLanguage parameter does not a have coresponding text field to their value field in LEVEL_OF_LANGUAGE_OPTIONS or NATIVE_LANGUAGE_OPTIONS object")

    const nextLanguageLevel = getNextLanguageLevel(levelOfLanguage)
    const languageLevelsForExampleSentences = `${levelOfLanguage}${nextLanguageLevel ? " to " + nextLanguageLevel : ""}`
    const promptWithoutWordsToProcess = getPromptWithoutWordsToProcess(nativeLanguage, languageToLearnValue, languageLevelsForExampleSentences)
    const prompt = promptWithoutWordsToProcess + "\n" + promptWordsToProcess
    return prompt
}

export default buildPrompt