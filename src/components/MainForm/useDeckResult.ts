import buildPrompt from "../../lib/buildPrompt"
import type { TFormValues } from "../../constants/mainForm"
import useSendAiRequest from "../../hooks/useSendAiRequest"

const useDeckResult = () => {

    const { isLoading, isStreaming, sendAiRequest, responseState } = useSendAiRequest()

    async function generateDeck(data: TFormValues, apiKey: string) {
        if (!data["language-to-learn-select"] || !data["level-of-language-select"] || !data["native-language-select"] || !data["prompt-words-to-process"]) throw new Error("One of needed parameters is unefined")
        const prompt = buildPrompt(data)
        const res = sendAiRequest(prompt, apiKey)
        return res
    }

    return {
        generateDeck,
        isLoading,
        deckResult: responseState,
        isStreaming
    }
}

export default useDeckResult