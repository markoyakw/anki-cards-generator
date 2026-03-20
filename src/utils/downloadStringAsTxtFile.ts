const downloadStringAsTxtFile = (text: string, name: string) => {

    const blob = new Blob([text], { type: "text/plain" })
    const tempDownloadUrl = URL.createObjectURL(blob)
    const tempLink = document.createElement("a")

    tempLink.href = tempDownloadUrl
    tempLink.download = name
    tempLink.click()

    URL.revokeObjectURL(tempDownloadUrl)
}

export default downloadStringAsTxtFile