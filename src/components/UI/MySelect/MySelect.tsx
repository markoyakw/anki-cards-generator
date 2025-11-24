import { useEffect, useState, type FC, type OptionHTMLAttributes, type ReactElement, type SelectHTMLAttributes } from "react"
import classes from "./MySelect.module.css"

type TSelectChild = ReactElement<OptionHTMLAttributes<HTMLOptionElement> & { value: string }>

type TSelectProps = {
    children: TSelectChild[]
} & SelectHTMLAttributes<HTMLSelectElement>

const MySelect: FC<TSelectProps> = ({ children, ...props }) => {

    const [isSelectOpen, setIsSelectOpen] = useState(false)
    const [value, setValue] = useState(children[0].props.value)

    const onSelectBlur = () => {
        setIsSelectOpen(false)
    }
    const onSelectClick = () => {
        setIsSelectOpen(oldValue => !oldValue)
    }
    const onOptionChoose = (newValue: string) => {
        setValue(newValue)
    }

    const selectWrapperOpenClassName = isSelectOpen ? classes["select__wrapper--open"] : ""
    const selectMenuDropdownClassName = isSelectOpen ? "" : classes["select__menu-dropdown--closed"]

    return (
        <div className={`${classes["select__wrapper"]} ${selectWrapperOpenClassName}`}>
            <select {...props} className={classes["select"]}
                onClick={() => onSelectClick()}
                onBlur={() => onSelectBlur()}
                value={value}
                // onMouseDown={e => e.preventDefault()}
            >
                {children}
            </select>
            <ul onMouseDown={e => e.preventDefault()}
                className={`${classes["select__menu-dropdown"]} ${selectMenuDropdownClassName}`}
            >
                {children.map((option, optionId) =>
                    <li key={optionId} className={classes["select__option"]} onClick={() => onOptionChoose(option.props.value)}>
                        {option}
                    </li>
                )}
            </ul>
        </div>
    )
}

export default MySelect