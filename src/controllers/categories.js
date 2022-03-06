import connection from '../db.js'
import catchError from '../error/catchError.js'

export async function allCategories(req, res) {

    try {

        const { rows: arrCategories } = await connection.query(`
            SELECT * FROM categories
        `)

        res.send(arrCategories)

    } catch (error) {
        catchError(res. error)
    }
}

export async function newCategory(req, res) {
    const { name } = req.body
    
    try {
        
        const category = await connection.query(`
            SELECT * FROM categories WHERE name = ( $1 )
        `, [ name ])

        if(category.rows.length > 0) return res.sendStatus(409)

        await connection.query(`
            INSERT INTO categories ( name ) VALUES ( $1 )
        `, [ name ])

        res.sendStatus(201)

    } catch (error) {
        catchError(res, error)
    }
}