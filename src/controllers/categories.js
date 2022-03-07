import connection from '../db.js'
import catchError from '../error/catchError.js'
import { offsetLimit, setLimit, setOffset } from '../utils/offsetLimit.js'
import { setOrder, sortItems } from '../utils/order.js'

export async function allCategories(req, res) {

    const { limit, offset, order, desc } = req.query

    offsetLimit(offset, limit)

    const sortByFilters = {
        id: 1,
        name: 2
    }

    sortItems(order, desc, sortByFilters)

    try {

        const { rows: arrCategories } = await connection.query(`
            SELECT * FROM categories
                ${setOffset}
                ${setLimit}
                ${setOrder}
        `)

        res.send(arrCategories)

    } catch (error) {
        catchError(res.error)
    }
}

export async function newCategory(req, res) {
    const { name } = req.body

    try {

        const category = await connection.query(`
            SELECT * FROM categories WHERE name = ( $1 )
        `, [name])

        if (category.rows.length > 0) return res.sendStatus(409)

        await connection.query(`
            INSERT INTO categories ( name ) VALUES ( $1 )
        `, [name])

        res.sendStatus(201)

    } catch (error) {
        catchError(res, error)
    }
}