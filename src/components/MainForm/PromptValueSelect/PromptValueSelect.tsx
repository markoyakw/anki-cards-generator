import type { FC } from "react"
import MySelect from "../../UI/MySelect/MySelect"
import type { TFormValues, TLanguageToLearnOption, TLevelOfLanguageOption, TNativeLanguageOption } from "../../../constants/mainForm"
import type { ControllerRenderProps, FieldValues } from "react-hook-form"

type TPromptValueSelectProps<
    TFieldValues extends FieldValues = FieldValues & TFormValues
> = {
    labelText: string,
    options: readonly TLanguageToLearnOption[] | readonly TNativeLanguageOption[] | readonly TLevelOfLanguageOption[],
    id: string,
    useFormControllerField: ControllerRenderProps<TFieldValues>,
    isError?: boolean
}


const PromptValueSelect: FC<TPromptValueSelectProps> = ({
    labelText,
    options,
    id,
    useFormControllerField,
    isError
}) => {

    return (
        <>
            <label htmlFor={id}>
                {labelText}
            </label>
            <MySelect isError={isError} id={id} {...useFormControllerField}>
                {options.map((option, optionId) => (
                    <option key={optionId} value={option.value}>
                        {option.text}
                    </option>)
                )}
            </MySelect>
        </>
    )
}

export default PromptValueSelect