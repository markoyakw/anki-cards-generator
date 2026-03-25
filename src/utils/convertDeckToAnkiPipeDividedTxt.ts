import { LANGUAGE_CARD_FIELD_ORDER } from '../constants/languageCard'
import type { TLanguageCard } from '../types/languageCard'

export function convertDeckToAnkiPipeDividedTxt(text: string): string | null {
    const textWithoutExtention = text.replace(/```json|```|```text/g, '').trim()

    let cards: TLanguageCard[]
    try {
        cards = JSON.parse(textWithoutExtention)
    }
    catch (e) {
        try {
            const textInsideCurlyBrackets = textWithoutExtention.match(/\[.*\]/s)?.[0] ?? textWithoutExtention
            cards = JSON.parse(textInsideCurlyBrackets)
        }
        catch (e) {
            console.error("Invalid non-JSON response from an API, please try later", e)
            return null
        }
    }

    if (!Array.isArray(cards)) {
        console.error('Google Studio AI API response is not an array, please try again later')
        return null
    }

    const ankiDeckWithPipeDividedCards = cards.map(card => LANGUAGE_CARD_FIELD_ORDER.map(field => card[field] ?? ' ')
        .join('|'))
        .join('\n')

    return ankiDeckWithPipeDividedCards
}