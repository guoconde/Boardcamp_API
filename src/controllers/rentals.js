import connection from "../db.js"
import dayjs from "dayjs"
import catchError from "../error/catchError.js"
import { utilRental, utilSum } from "../utils/utilMap.js"
import calculator from "../utils/calculator.js"
import sqlstring from "sqlstring"
import { offsetLimit, setLimit, setOffset } from "../utils/offsetLimit.js"
import { setOrder, sortItems } from "../utils/order.js"

export async function allRentals(req, res) {

    let { customerId, gameId, limit, offset, desc, order, status, startDate } = req.query

    let filter = ''

    offsetLimit(limit, offset)

    const sortByFilters = {
        id: 1,
        customerId: 2,
        gameId: 3,
        rentDate: 4,
        daysRented: 5,
        returnDate: 6,
        originalPrice: 7,
        delayFee: 8
    }

    sortItems(order, desc, sortByFilters)

    if (customerId) filter = `WHERE rentals."customerId" = ${sqlstring.escape(customerId)}`
    if (gameId) filter = `WHERE rentals."gameId" = ${sqlstring.escape(gameId)}`

    if (status === 'open' || status === 'closed') {
        filter.includes('WHERE') ? filter = filter + ' AND' : filter = 'WHERE';
        status === 'open' ? filter = filter + ` "returnDate" is null` : filter = filter + ` "returnDate" is not null`
    }

    if (startDate) {
        filter.includes('WHERE') ? filter = filter + ' AND' : filter = 'WHERE'
        filter = filter + ` "rentDate" >= ${sqlstring.escape(startDate)}`
    }

    try {

        let { rows: arrRentals } = await connection.query(`
            SELECT * FROM rentals 
                ${filter}
                ${setOffset}
                ${setLimit}
                ${setOrder}
        `)

        const { rows: arrGames } = await connection.query(`
            SELECT 
                games.id, 
                games."categoryId", 
                games.name AS "name",
                categories.name AS "categoryName"
            FROM games 
                JOIN categories ON games."categoryId" = categories.id
        `)

        const { rows: arrCustomers } = await connection.query(`SELECT id, name FROM customers`)

        arrRentals = utilRental(arrRentals, arrCustomers, arrGames)

        res.send(arrRentals)

    } catch (error) {
        catchError(res, error)
    }
}

export async function newRental(req, res) {
    const { customerId, gameId, daysRented } = req.body

    const rentDate = dayjs().format('YYYY-MM-DD')
    const returnDate = null
    const delayFee = null

    try {

        const { rows: qtdStock } = await connection.query(`
            SELECT "delayFee" FROM rentals WHERE "gameId" = ( $1 )  
        `, [gameId])

        let rentCount = 0

        qtdStock.filter(el => el.delayFee === null && rentCount++)

        const { rows: game } = await connection.query(`
            SELECT * FROM games WHERE id = ( $1 )
        `, [gameId])

        if (rentCount >= game[0].stockTotal) return res.sendStatus(400)

        const originalPrice = game[0].pricePerDay * daysRented

        const { rows: customer } = await connection.query(`
            SELECT * FROM customers WHERE id = ( $1 )
        `, [customerId])

        if (customer.length === 0 || game.length === 0) return res.sendStatus(400)

        await connection.query(`
        INSERT INTO rentals ( "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee" ) VALUES ( $1, $2, $3, $4, $5, $6, $7 )
        `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee])

        res.sendStatus(201)

    } catch (error) {
        catchError(res, error)
    }
}

export async function returnRental(req, res) {
    const { id } = req.params

    const returnDate = dayjs().format('YYYY-MM-DD')

    try {

        const { rows: rentals } = await connection.query(`
            SELECT * FROM rentals WHERE id = $1
        `, [id])

        if (rentals.length === 0) return res.sendStatus(404)

        if (rentals[0].returnDate !== null) return res.sendStatus(400)

        const delayFee = calculator(rentals[0].rentDate, rentals[0].daysRented, rentals[0].originalPrice)

        await connection.query(`
            UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3
        `, [returnDate, delayFee, id])

        res.sendStatus(200)

    } catch (error) {
        catchError(res, error)
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params

    try {

        const { rows: rentals } = await connection.query(`
            SELECT * FROM rentals WHERE id = ( $1 )
        `, [id])

        if (rentals.length === 0) return res.sendStatus(404)

        if (rentals[0].returnDate !== null) return res.sendStatus(400)

        await connection.query(`
            DELETE FROM rentals WHERE id = ( $1 )
        `, [id])

        res.sendStatus(200)

    } catch (error) {
        catchError(res, error)
    }
}

export async function allMetrics(req, res) {
    const { startDate, endDate } = req.query

    let filter = ''

    if (startDate && endDate) {
        filter = `WHERE "rentDate" >= ${sqlstring.escape(startDate)} AND "rentDate" <= ${sqlstring.escape(endDate)}` 
    } else if (startDate) {
        filter = `WHERE "rentDate" >= ${sqlstring.escape(startDate)}` 
    } else if (endDate) {
        filter = `WHERE "rentDate" <= ${sqlstring.escape(startDate)}` 
    }

    try {
        
        let { rows: sumRentals } = await connection.query(`
            SELECT SUM("originalPrice") AS "originalSum",
                SUM("delayFee") AS "delaySum",
                COUNT(id) AS rentals
                FROM rentals
                ${filter}
        `)

        sumRentals = utilSum(sumRentals)
        
        res.send(sumRentals[0])

    } catch (error) {
        catchError(res, error)
    }
}