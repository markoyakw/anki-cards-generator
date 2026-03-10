import { GoogleGenAI } from "@google/genai";
import { useState } from "react"
// const googleAiApiKey = import.meta.env.VITE_GOOGLE_AI_KEY
// const ai = new GoogleGenAI({ apiKey: googleAiApiKey });

const useSendAiRequest = (googleAiApiKey: string) => {

    const [isLoading, setIsLoading] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [response, setResponse] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const sendAiRequest = async (propmt: string) => {

        setIsLoading(true)
        setResponse("")

        try {
            const ai = new GoogleGenAI({ apiKey: googleAiApiKey })
            const response = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: propmt
            });

            for await (const chunk of response) {
                setError(null)
                setIsStreaming(true)
                setIsLoading(false)
                setResponse(oldData => {
                    if (!oldData) return "" + chunk.text
                    return oldData + chunk.text
                });
            }
            return { message: response, error: null }
        }
        catch (e) {
            if (e instanceof Error) {
                setError(e.message)
                return { message: null, error: e.message }
            }
            else {
                setError("An unexpected error occured, try later")
                return { message: null, error: "An unexpected error occured, try later" }
            }
        }
        finally {
            setIsLoading(false)
            setIsStreaming(false)
        }
    }

    return { isLoading, isStreaming, response, sendAiRequest, error }
}

export default useSendAiRequest