import dayjs from "dayjs"

function utilCustomer(list) {
    return list.rows.map(customer => ({
        ...customer,
        birthday: dayjs(customer.birthday).format('YYYY-MM-DD'),
    })
    )
}

function utilRental(list, arrCustomers, arrGames) {
    return list.map(rental => ({
        ...rental,
        customer: arrCustomers.find(customer => customer.id === rental.customerId),
        game: arrGames.find(game => game.id === rental.gameId)
    })
    )
}

export {
    utilCustomer,
    utilRental,
}
