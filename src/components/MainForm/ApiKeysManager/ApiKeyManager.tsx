import { useState, type FC } from "react"
import MyButton from "../../UI/MyButton/MyButton"
import MyInput from "../../UI/MyInput/MyInput"
import classes from "./ApiKeyManager.module.css"
import { FaSave } from "react-icons/fa"
import { ImCheckmark } from "react-icons/im"
import { Controller, type Control, type UseFormWatch } from "react-hook-form"
import type { TFormValues } from "../../../constants/mainForm"
import type useApiKeyManager from "./useApiKeyManager"

type TApiKeyManagerProps = {
    control: Control<TFormValues>
    apiKey: string
    watch: UseFormWatch<TFormValues>
} & ReturnType<typeof useApiKeyManager>

const ApiKeyManager: FC<TApiKeyManagerProps> = ({ control, onNewApiKeySave, validLocalKey, isKeyCheckLoading, watch }) => {

    const newApiKey = watch("new-api-key")

    const [error, setError] = useState<string | null>(null)

    const saveNewApiKeyHandler = async () => {
        const res = await onNewApiKeySave(newApiKey)
        if (res.error) {
            setError(res.error)
            control.setError("new-api-key", { message: res.error })
        }
    }

    return (
        <div className={classes["key-manager__container"]}>

            {/* valid/invalid icons */}
            {validLocalKey
                ? <ImCheckmark className={`${classes["key-manager__status-icon"]} ${classes["key-manager__status-icon--success"]}`} />
                : <div className={`${classes["key-manager__status-icon"]}  ${classes["key-manager__status-icon--error"]}`}>!</div>
            }

            <Controller control={control} name="new-api-key"
                render={({ field }) => {
                    return <MyInput label="new API key" {...field} />
                }}
                rules={{
                    validate: () => {
                        return error || true
                    }
                }}
            />

            <MyButton onClick={saveNewApiKeyHandler} loading={isKeyCheckLoading} type="button" disabled={!newApiKey}>
                <FaSave />
            </MyButton>
        </div >
    )
}

export default ApiKeyManager