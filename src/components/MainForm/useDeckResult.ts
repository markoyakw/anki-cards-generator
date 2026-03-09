import { useState } from "react"
import buildPrompt from "../../lib/buildPrompt"
import { GoogleGenAI } from "@google/genai"
import type { TFormValues } from "../../constants/mainForm"

const googleAiApiKey = import.meta.env.VITE_GOOGLE_AI_KEY
const ai = new GoogleGenAI({ apiKey: googleAiApiKey });

const useDeckResult = () => {

    const [deckResult, setDeckResult] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)

    async function generateDeck(data: TFormValues) {
        if (!data["language-to-learn-select"] || !data["level-of-language-select"] || !data["native-language-select"] || !data["prompt-words-to-process"]) throw new Error("One of needed parameters is unefined")
        setIsLoading(true)
        setDeckResult("")

        try {
            const prompt = buildPrompt(data)
            const response = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: prompt
            });

            for await (const chunk of response) {
                setIsStreaming(true)
                setIsLoading(false)
                setDeckResult(oldData => oldData + chunk.text);
            }
        }
        catch (e) {
            console.error("Streaming error", e)
        }
        finally {
            setIsLoading(false)
            setIsStreaming(false)
        }
    }

    return {
        generateDeck,
        isLoading,
        deckResult,
        isStreaming
    }
}

export default useDeckResult