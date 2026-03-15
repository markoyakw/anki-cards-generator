import { useEffect, useRef, type FC } from "react"
import MyButton from "../../UI/MyButton/MyButton"
import MyInput from "../../UI/MyInput/MyInput"
import classes from "./ApiKeyManager.module.css"
import { FaSave } from "react-icons/fa"
import { ImCheckmark } from "react-icons/im"
import { Controller, type Control } from "react-hook-form"
import type { TFormValues } from "../../../constants/mainForm"
import type useApiKeyManager from "./useApiKeyManager"

type TApiKeyManagerProps = {
    control: Control<TFormValues>
    apiKey: string
} & ReturnType<typeof useApiKeyManager>

const ApiKeyManager: FC<TApiKeyManagerProps> = ({ control, onNewApiKeySave, validLocalKey, isKeyCheckLoading, keyCheckError, apiKey }) => {

    const apiKeyValueRef = useRef<string>("")
    useEffect(() => {
        if (keyCheckError) {
            control.setError("new-api-key", { message: "please, provide a valid Google AI Studio API key" })
        }
        else {
            control.setError("new-api-key", {})
        }
    }, [keyCheckError])

    return (
        <div className={classes["key-manager__container"]}>

            {validLocalKey
                ? <ImCheckmark className={`${classes["key-manager__status-icon"]} ${classes["key-manager__status-icon--success"]}`} />
                : <div className={`${classes["key-manager__status-icon"]}  ${classes["key-manager__status-icon--error"]}`}>!</div>
            }

            <Controller control={control} name="new-api-key"
                rules={{
                    required: "please, provide an API key"
                }}
                render={({ field }) => {
                    apiKeyValueRef.current = field.value
                    return <MyInput label="new API key" {...field} />
                }}
            />

            <MyButton onClick={() => onNewApiKeySave(apiKeyValueRef.current)} loading={isKeyCheckLoading} type="button">
                <FaSave />
            </MyButton>
        </div>
    )
}

export default ApiKeyManager