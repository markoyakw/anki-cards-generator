const downloadStringAsTxtFile = (text: string, name: string) => {

    if (!window.Blob || !URL.createObjectURL) return false
    if (!text) return false

    try {
        const blob = new Blob([text], { type: "text/plain" })
        const tempDownloadUrl = URL.createObjectURL(blob)
        const tempLink = document.createElement("a")

        tempLink.href = tempDownloadUrl
        tempLink.download = name
        tempLink.click()

        setTimeout(() => URL.revokeObjectURL(tempDownloadUrl), 100)

        return true
    } catch {
        return false
    }
}

export default downloadStringAsTxtFile