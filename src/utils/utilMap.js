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

function utilSum(list, arrCustomers, arrGames) {
    return list.map(rental => ({
        revenue: parseInt(rental.originalSum + rental.delaySum),
        rentals: parseInt(rental.rentals),
        average: Math.round((rental.originalSum + rental.delaySum) / rental.rentals)
    })
    )
}

export {
    utilCustomer,
    utilRental,
    utilSum
}
