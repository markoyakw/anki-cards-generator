import { useEffect, useState, type ChangeEvent } from "react"
import MyButton from "../../UI/MyButton/MyButton"
import MyInput from "../../UI/MyInput/MyInput"
import classes from "./ApiKeyManager.module.css"
import useSendAiRequest from "../../../hooks/useSendAiRequest"

const ApiKeyManager = () => {

    const [validLocalKey, setValidLocalKey] = useState<null | string>(null)
    const [newKey, setNewKey] = useState("")
    const { error, sendAiRequest, response } = useSendAiRequest(newKey)

    const onKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewKey(e.target.value)
    }
    const onApiKeySave = async () => {
        //ping to check if the key is valid, in that case save it to a localStorage
        const responseObj = await sendAiRequest("ping")
        if (!responseObj.error && responseObj.message) {
            window.localStorage.setItem("apiKey", newKey)
        }
    }

    useEffect(() => {
        const checkIfKeyValidOnAppStart = async () => {
            const storedKey = window.localStorage.getItem("apiKey")
            if (!storedKey) return
            await sendAiRequest("ping")
            if (!error && response) {
                setValidLocalKey(storedKey)
            }
        }
        checkIfKeyValidOnAppStart()
    }, [])

    console.log(error, response)

    return (
        <div className={classes["key-manager-container"]}>
            <MyInput value={newKey} onChange={onKeyChange} type="password" />
            <MyButton onClick={onApiKeySave}>set API key</MyButton>
        </div>
    )
}

export default ApiKeyManager