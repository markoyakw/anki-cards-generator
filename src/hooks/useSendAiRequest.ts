import { GoogleGenAI } from "@google/genai";
import { useState } from "react"
import parseGoogleError from "../utils/parseGoogleError";
// const googleAiApiKey = import.meta.env.VITE_GOOGLE_AI_KEY
// const ai = new GoogleGenAI({ apiKey: googleAiApiKey });

const useSendAiRequest = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [responseState, setResponseState] = useState<string | null>(null)

    const sendAiRequest = async (propmt: string, apiKey: string): Promise<{ message: string | null, error: string | null, code: number | undefined }> => {

        setIsLoading(true)
        setResponseState("")

        try {
            const ai = new GoogleGenAI({ apiKey })
            const response = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: propmt
            });

            for await (const chunk of response) {
                setIsStreaming(true)
                setIsLoading(false)
                setResponseState(oldData => {
                    if (!oldData) return "" + chunk.text
                    return oldData + chunk.text
                });
            }

            return { message: "the answer was generated successfully", error: null, code: 200 }
        }
        catch (e) {
            if (e instanceof Error) {
                const parsedError = parseGoogleError(e)
                return { message: null, error: parsedError.message, code: parsedError.code }
            }
            else {
                return { message: null, error: "An unexpected error occured, try later", code: 500 }
            }
        }
        finally {
            setIsLoading(false)
            setIsStreaming(false)
        }
    }

    return { isLoading, isStreaming, responseState, sendAiRequest }
}

export default useSendAiRequest