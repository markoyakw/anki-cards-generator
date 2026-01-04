import { useCallback, useMemo, useState } from "react";

type TRule = TRuleRequired | TRuleMinLength | TRuleMaxLength
type TRuleRequired = { type: "required" }
type TRuleMinLength = { type: "minLength"; value: number }
type TRuleMaxLength = { type: "maxLength"; value: number }
type TSupportedValue = boolean | string
type TFieldError = Record<string, string[]>

type TField = {
    name: string,
    value: TSupportedValue,
    rules?: TRule[]
}

const validateValue = (
    value: TSupportedValue,
    rules: TRule[] = []
): string[] => {
    const errors: string[] = []

    for (const rule of rules) {
        switch (rule.type) {
            case "required":
                if (
                    value === "" ||
                    value === false ||
                    value === null ||
                    value === undefined
                ) {
                    errors.push("This field is required")
                }
                break

            case "minLength":
                if (typeof value === "string" && value.length < rule.value) {
                    errors.push(`Minimum length is ${rule.value}`)
                }
                break

            case "maxLength":
                if (typeof value === "string" && value.length > rule.value) {
                    errors.push(`Maximum length is ${rule.value}`)
                }
                break  
        }
    }

    return errors
}

export const useValidateLightForm = (fields: TField[]): { fields: TField[], errors: TFieldError, isValid: boolean, validateField: (name: string, value: TSupportedValue) => void } => {

    const rulesMap = useMemo(
        () =>
            Object.fromEntries(
                fields.map(f => [f.name, f.rules ?? []])
            ),
        [fields]
    )

    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const validateField = useCallback(
        (name: string, value: TSupportedValue) => {
            const rules = rulesMap[name]
            if (!rules) return

            const fieldErrors = validateValue(value, rules)

            setErrors(prev => ({
                ...prev,
                [name]: fieldErrors
            }))
        },
        [rulesMap]
    )

    const validateAll = useCallback(
        (values: Record<string, TSupportedValue>) => {
            const newErrors: Record<string, string[]> = {}

            for (const name in rulesMap) {
                const fieldErrors = validateValue(values[name], rulesMap[name])
                if (fieldErrors.length > 0) {
                    newErrors[name] = fieldErrors
                }
            }

            setErrors(newErrors)
            return newErrors
        },
        [rulesMap]
    )

    const isValid = Object.values(errors).every(e => e.length === 0)

    return {
        errors,
        isValid,
        validateField,
        validateAll
    }
}