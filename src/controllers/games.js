import connection from '../db.js'
import catchError from '../error/catchError.js'

export async function allGames(req, res) {

    let { name } = req.query

    console.log(req.query)
    console.log(name)

    let arrGames

    try {

        if (name) {

            arrGames = await connection.query(`
                SELECT games.*, categories.name AS "categoryName"
                  FROM games 
                  JOIN categories ON categories.id=games."categoryId"
                  WHERE LOWER(games.name) LIKE LOWER($1)
            `, [`${name}%`])

        } else {

            arrGames = await connection.query(`
            SELECT games.*, categories.name as "categoryName" FROM games 
            JOIN categories ON games."categoryId"=categories.id
            `)

        }

        res.send(arrGames.rows)

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