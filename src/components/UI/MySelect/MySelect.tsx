import { useEffect, useRef, useState, type FC, type OptionHTMLAttributes, type ReactElement, type SelectHTMLAttributes } from "react"
import classes from "./MySelect.module.css"

type TSelectChild = ReactElement<OptionHTMLAttributes<HTMLOptionElement> & { value: string }>

type TSelectProps = {
    children: TSelectChild[]
} & SelectHTMLAttributes<HTMLSelectElement>

const MySelect: FC<TSelectProps> = ({ children, ...props }) => {

    const [isSelectOpen, setIsSelectOpen] = useState(false)
    const [value, setValue] = useState(children[0].props.value)
    const selectRef = useRef(null)

    const onSelectBlur = (e: MouseEvent) => {
        if (e.target === selectRef.current) return
        setIsSelectOpen(false)
    }
    const onSelectClick = () => {
        setIsSelectOpen(oldValue => !oldValue)
    }
    const onOptionChoose = (newValue: string) => {
        setValue(newValue)
    }

    useEffect(() => {
        window.addEventListener("click", onSelectBlur)
    }, [])

    const selectWrapperClassName = `${classes["select__wrapper"]} ${isSelectOpen ? classes["select__wrapper--open"] : ""}`
    const selectClassName = `${classes["select"]} ${isSelectOpen ? classes["select--open"] : ""}`
    const selectMenuDropdownClassName = `${classes["select__menu-dropdown"]} ${isSelectOpen ? "" : classes["select__menu-dropdown--closed"]}`
    const getSelectOptionClassName = (optionValue: string) => `${classes["select__option"]} ${optionValue === value ? classes["select__option--active"] : ""}`

    return (
        <div className={selectWrapperClassName}>
            {/* readable select with options for screen readers */}
            <select {...props} className={selectClassName} ref={selectRef}
                onClick={() => onSelectClick()}
                onMouseDown={e => e.preventDefault()}
                // prevent opening a native select menu
                value={value}
            >
                {children}
            </select>

            {/* styled select drop menu as a workaround for css limitations*/}
            <ul className={selectMenuDropdownClassName}>
                {children.map((option, optionId) =>
                    <li key={optionId} className={getSelectOptionClassName(option.props.value)} onClick={() => onOptionChoose(option.props.value)}>
                        {option}
                    </li>
                )}
            </ul>
        </div>
    )
}

export default MySelect