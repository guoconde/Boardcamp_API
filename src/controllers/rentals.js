import connection from "../db.js"
import dayjs from "dayjs"
import catchError from "../error/catchError.js"

export async function allRentals(req, res) {

    try {
        
        const { rows: arrRentals } = await connection.query(`
            SELECT * FROM rentals
        `)

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
        
        const { rows: game } = await connection.query(`
            SELECT * FROM games WHERE id = ( $1 )
        `, [gameId])

        const originalPrice = game[0].pricePerDay * daysRented

        console.log(game)

        await connection.query(`
        INSERT INTO rentals ( "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee" ) VALUES ( $1, $2, $3, $4, $5, $6, $7 )
        `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee])

        res.sendStatus(201)

    } catch (error) {
        catchError(res, error)
    }
}