import MyCooldownButton from '../../UI/MyCooldownButton/MyCooldownButton'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { MdDownload } from 'react-icons/md'
import generateDownloadLanguageDeck from '../../../lib/generateAnkiCard/generateDownloadLanguageDeck'
import { useState, type FC } from 'react'
import type { TLanguageCard } from '../../../types/languageCard'
import type { TTargetLanguageValue } from '../../../constants/mainForm'

type TGenerateApkgWithVoiceButton = {
    cardArray: TLanguageCard[],
    downloadingFileName: string,
    isLoading: boolean | undefined,
    language: TTargetLanguageValue
}

const GenerateApkgWithVoiceButton: FC<TGenerateApkgWithVoiceButton> = ({ language, cardArray, downloadingFileName, isLoading }) => {

    const AUDIO_FIELDS_IN_CARD = 4
    const [progress, setProgress] = useState<{ current: number, total: number } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const loadingText = `${progress?.current}/${progress?.total} READY...`

    const handleApkgPronunciationExport = async () => {
        setProgress({ current: 0, total: cardArray.length * AUDIO_FIELDS_IN_CARD })
        try {
            await generateDownloadLanguageDeck(language, downloadingFileName, cardArray, {
                onProgress: (current, total) => setProgress({ current, total })
            })
            setProgress(null)
        } catch (e) {
            setError("true")
        } finally {
            setProgress(null)
        }
    }

    return (
        <MyCooldownButton error={error} alignTo="left" CooldownIcon={IoIosCheckmarkCircle} ButtonIcon={MdDownload}
            cooldownText="SUCCESS" onClick={handleApkgPronunciationExport}
            isLoading={isLoading || progress !== null}
            loadingText={loadingText}
        >
            .APKG+VOICE
        </MyCooldownButton>
    )
}

export default GenerateApkgWithVoiceButton