import { useState } from 'react'
import MyButton from '../UI/MyButton/MyButton'
import PromptValueSelect from './PromptValueSelect/PromptValueSelect'
import MyDividerLine from '../UI/MyDividerLine/MyDividerLine'
import MyTextarea from '../UI/MyTextarea/MyTextarea'
import classes from "./MainForm.module.css"
import { GoogleGenAI } from '@google/genai'
import MyCopyableTextBlock from '../UI/MyCopyableTextBlock/MyCopyableTextBlock'
import { LANGUAGE_TO_LEARN_OPTIONS, LEVEL_OF_LANGUAGE_OPTIONS, NATIVE_LANGUAGE_OPTIONS, type TFormValues } from '../../constants/mainForm'
import buildPrompt from '../../lib/buildPrompt'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import MyError from '../UI/MyError/MyError'

const MainForm = () => {

    const MINIMAL_LIST_OF_WORDS_STRING_LENGTH = 20
    const [deckResult, setDeckResult] = useState<string>("")
    const { handleSubmit, control, getValues, formState: { errors, isValid, isDirty, isSubmitted } } = useForm<TFormValues>({
        mode: "onTouched",
        reValidateMode: "onChange"
    });

    const googleAiApiKey = import.meta.env.VITE_GOOGLE_AI_KEY
    const ai = new GoogleGenAI({ apiKey: googleAiApiKey });

    async function generateDeck(data: TFormValues) {
        if (!data["language-to-learn-select"] || !data["level-of-language-select"] || !data["native-language-select"] || !data["prompt-words-to-process"]) throw new Error("One of needed parameters is unefined")
        const prompt = buildPrompt(data)
        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        for await (const chunk of response) {
            setDeckResult(oldData => oldData + chunk.text);
        }
    }

    const onSubmit: SubmitHandler<TFormValues> = (data) => {
        // generateDeck(data)
    }

    return (
        <div className={classes["deck-generator"]}>
            <form className={classes["form"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={classes["form__textarea-row"]}>
                    <label htmlFor="prompt-words-to-process">
                        List of words or phrases for cards generation:
                    </label>
                    <Controller control={control} name="prompt-words-to-process"
                        rules={{
                            minLength: { value: MINIMAL_LIST_OF_WORDS_STRING_LENGTH, message: `minimal list of words or phrases for card generation field length is ${MINIMAL_LIST_OF_WORDS_STRING_LENGTH} symbols` },
                            required: "all fields must be filled"
                        }}
                        render={({ field }) => (
                            <MyTextarea id="prompt-words-to-process" {...field} isError={Boolean(errors["prompt-words-to-process"])} />
                        )} />
                </div>

                <div className={classes["form__dividers-controller"]}>
                    <MyDividerLine orientation="vertical" />
                    <MyDividerLine orientation="horisontal" />
                </div>

                <div className={classes["form__controlls-row"]}>
                    <div className={classes["form__select-and-title"]}>
                        <Controller name='native-language-select' control={control}
                            rules={{ required: "all fields must be filled" }}
                            render={({ field }) => (
                                <PromptValueSelect labelText="Native language:" useFormControllerField={field}
                                    options={NATIVE_LANGUAGE_OPTIONS} id={"native-language-select"}
                                    isError={!!errors["native-language-select"]}
                                />)}
                        />
                    </div>

                    <div className={classes["form__select-and-title"]}>
                        <Controller name='language-to-learn-select' control={control}
                            rules={{ required: "all fields must be filled" }}
                            render={({ field }) => (
                                <PromptValueSelect labelText="Language, that you learn:" useFormControllerField={field}
                                    options={LANGUAGE_TO_LEARN_OPTIONS} id={"language-to-learn-select"}
                                    isError={!!errors["language-to-learn-select"]}
                                />)}
                        />
                    </div>

                    <div className={classes["form__select-and-title"]}>
                        <Controller name='level-of-language-select' control={control}
                            rules={{ required: "all fields must be filled" }}
                            render={({ field }) => (
                                <PromptValueSelect labelText="Level of language:" useFormControllerField={field}
                                    options={LEVEL_OF_LANGUAGE_OPTIONS} id={"level-of-language-select"}
                                    isError={!!errors["level-of-language-select"]}
                                />)}
                        />
                    </div>

                    <MyError>
                        {errors["prompt-words-to-process"]?.message || errors['language-to-learn-select']?.message ||
                            errors["level-of-language-select"]?.message || errors["root"]?.message || errors["native-language-select"]?.message}
                    </MyError>
                    <div className={classes["form__button"]}>
                        <MyButton type='submit' disabled={!isValid && isDirty && isSubmitted} loading>
                            generate
                        </MyButton>
                    </div>
                </div>
            </form >
            {deckResult &&
                <MyCopyableTextBlock id='deck-result' label={`${getValues("native-language-select")}-${getValues("language-to-learn-select")}-${getValues("level-of-language-select")}`}>
                    {deckResult}
                </MyCopyableTextBlock>
            }
        </div >
    )
}

export default MainForm
