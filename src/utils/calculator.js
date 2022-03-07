import dayjs from "dayjs"

export default function calculator(rented, days, originalPrice) {
    const difference = Math.ceil(dayjs().diff(rented) / 1000 / 60 / 60 / 24)
    const pricePerDay = originalPrice / days

    const differenceDays = difference - days

    if (differenceDays >= 0) return 0

    return Math.abs(differenceDays * pricePerDay)
}