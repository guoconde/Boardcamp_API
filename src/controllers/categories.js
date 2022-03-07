import connection from '../db.js'
import catchError from '../error/catchError.js'
import { offsetLimit, setLimit, setOffset } from '../utils/offsetLimit.js'

export async function allCategories(req, res) {

    const { limit, offset } = req.query

    offsetLimit(offset, limit)

    try {

        const { rows: arrCategories } = await connection.query(`
            SELECT * FROM categories
                ${setOffset}
                ${setLimit}
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