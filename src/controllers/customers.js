import connection from "../db.js"
import catchError from "../error/catchError.js"
import { offsetLimit, setLimit, setOffset } from "../utils/offsetLimit.js"
import { setOrder, sortItems } from "../utils/order.js"
import { utilCustomer } from "../utils/utilMap.js"

export async function allCustomers(req, res) {

    const { cpf, limit, offset, order, desc } = req.query

    offsetLimit(offset, limit)

    const sortByFilters = {
        id: 1,
        name: 2,
        phone: 3,
        cpf: 4,
        birthday: 5,
        rentalsCount: 6
    }

    sortItems(order, desc, sortByFilters)

    try {

        if (cpf) {
            let arrCustomers = await connection.query(`
                SELECT * FROM customers WHERE cpf LIKE $1
            `, [`${cpf}%`])

            arrCustomers = utilCustomer(arrCustomers)

            res.send(arrCustomers)
        }

        let arrCustomers = await connection.query(`
            SELECT * FROM customers
                ${setOffset}
                ${setLimit}
                ${setOrder}
        `)

        arrCustomers = utilCustomer(arrCustomers)

        res.send(arrCustomers)

    } catch (error) {
        catchError(res, error)
    }
}

export async function newCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body

    try {

        const { rows: customer } = await connection.query(`
            SELECT * FROM customers WHERE cpf = ( $1 )
        `, [cpf])

        if (customer.length > 0) return res.sendStatus(409)

        await connection.query(`
            INSERT INTO customers ( name, phone, cpf, birthday ) VALUES ( $1, $2, $3, $4 )
        `, [name, phone, cpf, birthday])

        res.sendStatus(201)

    } catch (error) {
        catchError(res, error)
    }

}

export async function selectedCustomer(req, res) {
    const { id } = req.params

    try {

        let customerById = await connection.query(`
            SELECT * FROM customers WHERE id = ( $1 )
        `, [id])

        if (customerById.rows.length === 0) return res.sendStatus(404)

        customerById = utilCustomer(customerById)

        res.send(customerById[0])

    } catch (error) {
        catchError(res, error)
    }
}

export async function updateCustomer(req, res) {
    const { id } = req.params
    const { name, phone, cpf, birthday } = req.body

    try {

        const { rows: customer } = await connection.query(`
            SELECT * FROM customers WHERE id=$1
        `, [id])

        const { rows: cpfCustomer } = await connection.query(`
            SELECT id FROM customers WHERE cpf=$1
        `, [cpf])

        if (cpfCustomer.length > 0 && cpf !== customer[0].cpf) {
            return res.sendStatus(409)
        }

        await connection.query(`
            UPDATE customers
            SET name = $1, cpf = $2, phone = $3, birthday = $4 
            WHERE id=$5
        `, [name, cpf, phone, birthday, id])

        res.sendStatus(200)

    } catch (error) {
        catchError(res, error)
    }
}