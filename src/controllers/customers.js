import connection from "../db.js"

export async function allCustomers(req, res) {

    try {

        const { rows: arrCustomers } = await connection.query(`
            SELECT * FROM customers
        `)

        res.send(arrCustomers)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export async function newCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body

    try {

        const customer = await connection.query(`
            SELECT * FROM customers WHERE cpf = ( $1 )
        `, [cpf])

        if(customer.rows.length > 0) return res.sendStatus(409)

        await connection.query(`
            INSERT INTO customers ( name, phone, cpf, birthday ) VALUES ( $1, $2, $3, $4 )
        `, [name, phone, cpf, birthday])

        res.sendStatus(201)
        
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }

}