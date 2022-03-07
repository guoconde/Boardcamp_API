import connection from "../db.js"
import dayjs from "dayjs"
import catchError from "../error/catchError.js"
import { utilRental } from "../utils/utilMap.js"

export async function allRentals(req, res) {

    let { customerId, gameId } = req.query

    let filter = ''

    try {

        if (customerId) {
            filter = `WHERE rentals."customerId" = ${customerId}`
        }

        if (gameId) {
            filter = `WHERE rentals."gameId" = ${gameId}`
        }

        let { rows: arrRentals } = await connection.query(`
            SELECT * FROM rentals ${filter}
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

        const { rows: arrCustomers } = await connection.query(`SELECT id, name FROM customers`);

        arrRentals = utilRental(arrRentals, arrCustomers, arrGames)

        res.send(arrRentals);

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
            SELECT * FROM rentals WHERE "gameId" = ( $1 )  
        `, [gameId])

        const { rows: game } = await connection.query(`
            SELECT * FROM games WHERE id = ( $1 )
        `, [gameId])

        if (qtdStock.length >= game[0].stockTotal) return res.sendStatus(400)

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