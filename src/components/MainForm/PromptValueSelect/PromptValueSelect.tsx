import type { ChangeEvent, FC } from "react"
import MySelect from "../../UI/MySelect/MySelect"
import type { TLanguageToLearnOption, TLanguageToLearnValue, TLevelOfLanguageOption, TLevelOfLanguageValue, TNativeLanguageOption, TNativeLanguageValue } from "../../../constants/mainForm"

type TPromptValueSelectProps = {
    labelText: string,
    selectValue: TNativeLanguageValue | TLanguageToLearnValue | TLevelOfLanguageValue | undefined,
    onSelectValueChange: (e: ChangeEvent<HTMLSelectElement & {
        value: TNativeLanguageValue & TLanguageToLearnValue & TLevelOfLanguageValue
    }>) => void,
    options: readonly TLanguageToLearnOption[] | readonly TNativeLanguageOption[] | readonly TLevelOfLanguageOption[],
    id: string
}


const PromptValueSelect: FC<TPromptValueSelectProps> = ({
    labelText,
    selectValue,
    onSelectValueChange,
    options,
    id
}) => {

    return (
        <>
            <label htmlFor={id}>
                {labelText}
            </label>
            <MySelect id={id} value={selectValue} onChange={onSelectValueChange}>
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