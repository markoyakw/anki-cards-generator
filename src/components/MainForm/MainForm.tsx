import { useState } from 'react'
import MyButton from '../UI/MyButton/MyButton'
import MyDividerLine from '../UI/MyDividerLine/MyDividerLine'
import MyTextarea from '../UI/MyTextarea/MyTextarea'
import classes from "./MainForm.module.css"
import GeneratedDeckTextBlock from './GeneratedDeckTextBlock/GeneratedDeckTextBlock'
import { type TFormValues } from '../../constants/mainForm'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import MyError from '../UI/MyError/MyError'
import useDeckResult from './useDeckResult'
import ApiKeyManager from './ApiKeysManager/ApiKeyManager'
import LanguageSelects from './LanguageSelects'
import useApiKeyManager from './ApiKeysManager/useApiKeyManager'

const MainForm = () => {

    const MINIMAL_LIST_OF_WORDS_STRING_LENGTH = 20
    const { generateDeck, isLoading, isStreaming, deckResult } = useDeckResult()
    const [isTextBlockCollapsed, setIsTextBlockCollapsed] = useState(true)
    const toggleIsTextBlockCollapsed = () => setIsTextBlockCollapsed(oldState => !oldState)

    const { handleSubmit, control, watch, getValues, formState: { errors, isValid, isDirty, isSubmitted } } = useForm<TFormValues>({
        mode: "onTouched",
        reValidateMode: "onChange"
    });

    const keyManagerProps = useApiKeyManager()
    const validLocalKey = keyManagerProps.validLocalKey
    const isSubmitButtonDisabled = (!isValid && isDirty && isSubmitted) || !validLocalKey

    const onSubmit: SubmitHandler<TFormValues> = async (data) => {
        if (!validLocalKey) throw new Error("the API key is not provided")
        const res = await generateDeck(data, validLocalKey)
        if (res.error) {
            control.setError("new-api-key", { message: res.error })
        }
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
                            <MyTextarea shouldRecalculateHeight={!isStreaming} id="prompt-words-to-process" {...field} isError={Boolean(errors["prompt-words-to-process"])} />
                        )}
                    />
                </div>

                <div className={classes["form__dividers-controller"]}>
                    <MyDividerLine orientation="vertical" />
                    <MyDividerLine orientation="horisontal" />
                </div>

                <div className={classes["form__controlls-row"]}>

                    <LanguageSelects control={control} errors={errors} />

                    <MyError>
                        {errors["prompt-words-to-process"]?.message || errors['target-language-select']?.message ||
                            errors["level-of-language-select"]?.message || errors["root"]?.message || errors["native-language-select"]?.message}
                    </MyError>

                    <ApiKeyManager watch={watch} control={control} {...keyManagerProps} apiKey={getValues("new-api-key")} />

                    <MyError>
                        {errors["new-api-key"]?.message}
                    </MyError>

                    <div className={classes["form__button"]}>
                        <MyButton type='submit' disabled={isSubmitButtonDisabled} loading={isLoading}>
                            generate
                        </MyButton>
                    </div>
                </div>
            </form >

            {deckResult &&
                <GeneratedDeckTextBlock label={`${getValues("native-language-select")}-${getValues("target-language-select")}-${getValues("level-of-language-select")}`}
                    isCollapsed={isTextBlockCollapsed} toggleIsTextBlockCollapsed={toggleIsTextBlockCollapsed} isLoading={isStreaming} id='deck-result'
                    targetLanguage={getValues("target-language-select")}
                >
                    {deckResult}
                </GeneratedDeckTextBlock>
            }
        </div >
    )
}

export default MainForm