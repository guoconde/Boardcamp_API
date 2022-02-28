import connection from '../db.js'

export async function allCategories(req, res) {

    try {
        const { rows: arrCategories } = await connection.query(`
            SELECT * FROM categories
        `)
        res.send(arrCategories)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}