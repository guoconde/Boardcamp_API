import dayjs from "dayjs"

export default function utilMap(list) {
    return list.rows.map(customer => {
        return (customer = {
            ...customer,
            birthday: dayjs(customer.birthday).format('YYYY-MM-DD'),
        })
    })
}