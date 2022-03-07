import connection from '../db.js'
import catchError from '../error/catchError.js'
import { offsetLimit, setLimit, setOffset } from '../utils/offsetLimit.js'
import { setOrder, sortItems } from '../utils/order.js'

export async function allGames(req, res) {
    let { name, offset, limit, order, desc } = req.query

    offsetLimit(offset, limit)

    const sortByFilters = {
        id: 1,
        name: 2,
        image: 3,
        stockTotal: 4,
        categoryId: 5,
        pricePerDay: 6,
        categoryName: 7,
        rentalsCount: 8
    }

    sortItems(order, desc, sortByFilters)

    try {

        if (name) {

            const { rows: arrGames } = await connection.query(`
                SELECT games.*, categories.name AS "categoryName"
                FROM games 
                JOIN categories ON categories.id=games."categoryId"
                WHERE LOWER(games.name) LIKE LOWER($1)
                    ${setOffset}
                    ${setLimit}
                    ${setOrder}

            `, [`${name}%`])

            res.send(arrGames)

        } else {

            const { rows: arrGames } = await connection.query(`
                SELECT games.*, categories.name as "categoryName" FROM games 
                JOIN categories ON games."categoryId"=categories.id
                    ${setOffset}
                    ${setLimit}
                    ${setOrder}
            `)

            res.send(arrGames)
        }

    } catch (error) {
        catchError(res, error)
    }
}

export async function newGame(req, res) {
    let { name, image, stockTotal, categoryId, pricePerDay } = req.body

    pricePerDay = pricePerDay * 100
    stockTotal = parseInt(stockTotal)

    try {
        const { rows: game } = await connection.query(`
            SELECT * FROM games WHERE name = ( $1 )
        `, [name])

        const { rows: category } = await connection.query(`
            SELECT * FROM categories WHERE id = ( $1 )
        `, [categoryId])

        if (category.length === 0) return res.sendStatus(400)
        if (game.length > 0) return res.sendStatus(409)

        await connection.query(`
            INSERT INTO games ( name, image, "stockTotal", "categoryId", "pricePerDay" ) VALUES ( $1, $2, $3, $4, $5 )
        `, [name, image, stockTotal, categoryId, pricePerDay])

        res.sendStatus(201)

    } catch (error) {
        catchError(res, error)
    }
}