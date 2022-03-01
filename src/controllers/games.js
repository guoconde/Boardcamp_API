import connection from '../db.js'

export async function allGames(req, res) {

    try {

        const { rows: arrGames } = await connection.query(`
            SELECT * FROM games
        `)

        res.send(arrGames)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export async function newGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    try {
        const game = await connection.query(`
            SELECT * FROM games WHERE name = ( $1 )
        `, [name])

        if (game.rows.length > 0) return res.sendStatus(409)

        await connection.query(`
            INSERT INTO games ( name, image, "stockTotal", "categoryId", "pricePerDay" ) VALUES ( $1, $2, $3, $4, $5 )
        `, [name, image, stockTotal, categoryId, pricePerDay])

        res.sendStatus(201)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}