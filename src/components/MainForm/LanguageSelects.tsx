import classes from './MainForm.module.css'
import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import PromptValueSelect from './PromptValueSelect/PromptValueSelect'
import { TARGET_LANGUAGE_OPTIONS, LEVEL_OF_LANGUAGE_OPTIONS, NATIVE_LANGUAGE_OPTIONS, type TFormValues } from '../../constants/mainForm'
import type { FC } from 'react'

type TLanguageSelectsProps = {
    control: Control<TFormValues>,
    errors: FieldErrors<TFormValues>
}

const LanguageSelects: FC<TLanguageSelectsProps> = ({ control, errors }) => {
    return (
        <>
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
                <Controller name='target-language-select' control={control}
                    rules={{ required: "all fields must be filled" }}
                    render={({ field }) => (
                        <PromptValueSelect labelText="Language, that you learn:" useFormControllerField={field}
                            options={TARGET_LANGUAGE_OPTIONS} id={"target-language-select"}
                            isError={!!errors["target-language-select"]}
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
        </>
    )
}

export default LanguageSelects