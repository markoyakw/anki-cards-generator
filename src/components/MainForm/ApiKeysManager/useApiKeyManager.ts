import { useEffect, useState } from "react"
import useSendAiRequest from "../../../hooks/useSendAiRequest"

const useApiKeyManager = () => {

    const KEY_VALIDATION_CHECK_FREQUENCY = 1000 * 60 * 30

    const [validLocalKey, setValidLocalKey] = useState<null | string>(null)
    const { sendAiRequest } = useSendAiRequest()
    const [isKeyCheckLoading, setIsKeyCheckLoading] = useState(false)

    const onNewApiKeySave = async (newKey: string) => {
        //ping to check if the key is valid, in that case save it to a localStorage
        setIsKeyCheckLoading(true)
        const response = await sendAiRequest("ping", newKey)
        setIsKeyCheckLoading(false)

        if (response.error) {
            setValidLocalKey(null)
        }

        if (response.message) {
            setValidLocalKey(newKey)
            window.localStorage.setItem("apiKey", newKey)
            window.localStorage.setItem("lastSuccessfullAPiKeyValidationDate", String(Date.now()))
        }
        return response
    }

    useEffect(() => {
        const checkIfKeyValidOnAppStart = async () => {
            const storedKey = window.localStorage.getItem("apiKey")
            if (!storedKey) return

            //skip the check if the last successfull check was less than 5 min ago
            const lastSuccessfullCheckDate = Number(window.localStorage.getItem("lastSuccessfullAPiKeyValidationDate"))

            if (lastSuccessfullCheckDate && Date.now() - lastSuccessfullCheckDate < KEY_VALIDATION_CHECK_FREQUENCY) {
                setValidLocalKey(storedKey)
                return
            }

            if (!storedKey) return
            setIsKeyCheckLoading(true)
            const response = await sendAiRequest("ping", storedKey)
            setIsKeyCheckLoading(false)

            if (response.error) {
                setValidLocalKey(null)
                if (response.code === 400 || response.code === 403) {
                    window.localStorage.removeItem("apiKey")
                }
                window.localStorage.removeItem("lastSuccessfullAPiKeyValidationDate")
                return
            }
            if (response.message) {
                window.localStorage.setItem("lastSuccessfullAPiKeyValidationDate", String(Date.now()))
                setValidLocalKey(storedKey)
            }
        }
        checkIfKeyValidOnAppStart()
    }, [])

    return { onNewApiKeySave, validLocalKey, isKeyCheckLoading }
}

export default useApiKeyManager
