const getTimeAndDateString = () => {
    const date = new Date()
    const dateAndTimeString = date.getHours() + "-" + date.getMinutes() + " " + date.getDate() + "." + date.getMonth() + "." + date.getFullYear()
    return dateAndTimeString
}

export default getTimeAndDateString