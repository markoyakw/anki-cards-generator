import { useState } from 'react'
import MyButton from '../UI/MyButton/MyButton'
import MyDividerLine from '../UI/MyDividerLine/MyDividerLine'
import MyTextarea from '../UI/MyTextarea/MyTextarea'
import classes from "./MainForm.module.css"
import MyCopyableTextBlock from '../UI/MyCopyableTextBlock/MyCopyableTextBlock'
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

    const { handleSubmit, control, getValues, formState: { errors, isValid, isDirty, isSubmitted } } = useForm<TFormValues>({
        mode: "onTouched",
        reValidateMode: "onChange"
    });
    const keyManagerProps = useApiKeyManager()

    const onSubmit: SubmitHandler<TFormValues> = (data) => {
        generateDeck(data)
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
                        {errors["prompt-words-to-process"]?.message || errors['language-to-learn-select']?.message ||
                            errors["level-of-language-select"]?.message || errors["root"]?.message || errors["native-language-select"]?.message}
                    </MyError>

                    <ApiKeyManager control={control} {...keyManagerProps} apiKey={getValues("new-api-key")} />

                    <div className={classes["form__button"]}>
                        <MyButton type='submit' disabled={!isValid && isDirty && isSubmitted} loading={isLoading}>
                            generate
                        </MyButton>
                    </div>

                </div>
            </form >

            {deckResult &&
                <MyCopyableTextBlock label={`${getValues("native-language-select")}-${getValues("language-to-learn-select")}-${getValues("level-of-language-select")}`}
                    isCollapsed={isTextBlockCollapsed} toggleIsTextBlockCollapsed={toggleIsTextBlockCollapsed} isLoading={isStreaming} id='deck-result'
                >
                    {deckResult}
                </MyCopyableTextBlock>
            }
        </div >
    )
}

export default MainForm