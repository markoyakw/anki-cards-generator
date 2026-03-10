import { useState } from "react"
import buildPrompt from "../../lib/buildPrompt"
import { GoogleGenAI } from "@google/genai"
import type { TFormValues } from "../../constants/mainForm"
import useSendAiRequest from "../../hooks/useSendAiRequest"

const googleAiApiKey = import.meta.env.VITE_GOOGLE_AI_KEY
const ai = new GoogleGenAI({ apiKey: googleAiApiKey });

const useDeckResult = () => {

    const { isLoading, isStreaming, response, sendAiRequest } = useSendAiRequest("")

    async function generateDeck(data: TFormValues) {
        if (!data["language-to-learn-select"] || !data["level-of-language-select"] || !data["native-language-select"] || !data["prompt-words-to-process"]) throw new Error("One of needed parameters is unefined")
        const prompt = buildPrompt(data)
        sendAiRequest(prompt)
    }

    return {
        generateDeck,
        isLoading,
        deckResult: response,
        isStreaming
    }
}

export default useDeckResult