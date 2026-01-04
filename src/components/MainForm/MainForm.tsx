import { useState, type ChangeEvent } from 'react'
import MyButton from '../UI/MyButton/MyButton'
import PromptValueSelect from './PromptValueSelect/PromptValueSelect'
import MyDividerLine from '../UI/MyDividerLine/MyDividerLine'
import MyTextarea from '../UI/MyTextarea/MyTextarea'
import classes from "./MainForm.module.css"
import { GoogleGenAI } from '@google/genai'
import MyCopyableTextBlock from '../UI/MyCopyableTextBlock/MyCopyableTextBlock'
import { LANGUAGE_TO_LEARN_OPTIONS, LEVEL_OF_LANGUAGE_OPTIONS, NATIVE_LANGUAGE_OPTIONS, type TLanguageToLearnValue, type TLevelOfLanguageValue, type TNativeLanguageValue } from '../../constants/mainForm'
import buildPrompt from '../../lib/buildPrompt'

const MainForm = () => {

    const MINIMAL_LIST_OF_WORDS_STRING_LENGTH = 20
    const [nativeLanguage, setNativeLanguage] = useState<undefined | TNativeLanguageValue>("")
    const [languageToLearn, setLanguageToLearn] = useState<undefined | TLanguageToLearnValue>("")
    const [levelOfLanguage, setLevelOfLanguage] = useState<undefined | TLevelOfLanguageValue>("")
    const [listOfWords, setListOfWords] = useState<string>("")
    const [deckResult, setDeckResult] = useState<string>("")

    const onNativeLanguageChange = (e: ChangeEvent<HTMLSelectElement & { value: TNativeLanguageValue }>) => {
        setNativeLanguage(e.target.value)
    }
    const onLanguageToLearnChange = (e: ChangeEvent<HTMLSelectElement & { value: TLanguageToLearnValue }>) => {
        setLanguageToLearn(e.target.value)
    }
    const onLevelOfLanguageChange = (e: ChangeEvent<HTMLSelectElement & { value: TLevelOfLanguageValue }>) => {
        setLevelOfLanguage(e.target.value)
    }
    const onListOfWordsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setListOfWords(e.target.value)
    }

    const ai = new GoogleGenAI({ apiKey: "" });

    async function generateDeck(
        nativeLanguage: TNativeLanguageValue | undefined,
        languageToLearn: TLanguageToLearnValue | undefined,
        levelOfLanguage: TLevelOfLanguageValue | undefined
    ) {
        if (!nativeLanguage || !languageToLearn || !levelOfLanguage) throw new Error("One of needed parameters is unefined")
        const prompt = buildPrompt(nativeLanguage, languageToLearn, levelOfLanguage)
        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt + "\n" + listOfWords,
        });

        for await (const chunk of response) {
            setDeckResult(oldData => oldData + chunk.text);
        }
    }

    const isGenerateButtonDisabled = Boolean(!nativeLanguage || !languageToLearn || !levelOfLanguage || (listOfWords.length <= MINIMAL_LIST_OF_WORDS_STRING_LENGTH))

    return (
        <div className={classes["deck-generator"]}>
            <form className={classes["form"]}>
                <div className={classes["form__textarea-row"]}>
                    <label htmlFor="prompt-words-to-process">
                        List of words or phrases for cards generation:
                    </label>
                    <MyTextarea id="prompt-words-to-process" onChange={onListOfWordsChange} />
                </div>

                <div className={classes["form__dividers-controller"]}>
                    <MyDividerLine orientation="vertical" />
                    <MyDividerLine orientation="horisontal" />
                </div>

                <div className={classes["form__controlls-row"]}>
                    <div className={classes["form__select-and-title"]}>
                        <PromptValueSelect labelText="Native language:" selectValue={nativeLanguage}
                            onSelectValueChange={onNativeLanguageChange} options={NATIVE_LANGUAGE_OPTIONS}
                            id={"native-language-select"}
                        />
                    </div>

                    <div className={classes["form__select-and-title"]}>
                        <PromptValueSelect labelText="Language, that you learn:" selectValue={languageToLearn}
                            onSelectValueChange={onLanguageToLearnChange} options={LANGUAGE_TO_LEARN_OPTIONS}
                            id={"language-to-learn-select"}
                        />
                    </div>

                    <div className={classes["form__select-and-title"]}>
                        <PromptValueSelect labelText="Level of language:" selectValue={levelOfLanguage}
                            onSelectValueChange={onLevelOfLanguageChange} options={LEVEL_OF_LANGUAGE_OPTIONS}
                            id={"level-of-language-select"}
                        />
                    </div>

                    <div className={classes["form__button"]}>
                        <MyButton disabled={isGenerateButtonDisabled} onClick={() => generateDeck(nativeLanguage, languageToLearn, levelOfLanguage)} type='button'>generate</MyButton>
                    </div>
                </div>
            </form >
            {deckResult &&
                <MyCopyableTextBlock id='deck-result' label={`${nativeLanguage}-${languageToLearn}-${levelOfLanguage}`}>
                    {deckResult}
                </MyCopyableTextBlock>
            }
        </div >
    )
}

export default MainForm
