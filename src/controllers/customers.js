import dayjs from "dayjs";
import connection from "../db.js"
import catchError from "../error/catchError.js"

export async function allCustomers(req, res) {

    const { cpf } = req.query;

    try {

        if (cpf) {
            const cpfCustomersList = await connection.query(`
                SELECT * FROM customers WHERE cpf LIKE $1
            `, [`${cpf}%`]);

            const arrCustomers = cpfCustomersList.rows.map(customer => {
                return (customer = {
                    ...customer,
                    birthday: dayjs(customer.birthday).format('YYYY-MM-DD'),
                })
            })

            res.send(arrCustomers)
        }

        const { rows: allCustomers } = await connection.query(`
            SELECT * FROM customers
        `)

        const arrCustomers = allCustomers.map(customer => {
            return (customer = {
                ...customer,
                birthday: dayjs(customer.birthday).format('YYYY-MM-DD')
            })
        })

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

        const customerById = await connection.query(`
            SELECT * FROM customers WHERE id = ( $1 )
        `, [id])

        if(customerById.rows.length === 0) return res.sendStatus(404)

        const selectedById = customerById.rows.map(customer => {
            return (customer = {
                ...customer,
                birthday: dayjs(customer.birthday).format('YYYY-MM-DD')
            })
        })

        res.send(selectedById[0])

    } catch (error) {
        catchError(res, error)
    }
}

export async function insertCustomer(req, res) {
    const { name, phone, cpf, birthday } = res.locals.customerToInsert;

    try {
        await connection.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        console.error(error.message);
        res.sendStatus(500);
    }
}

export async function updateCustomer(req, res) {
    const { id, name, phone, cpf, birthday } = res.locals.customerToUpdate;

    try {
        await connection.query(
            `UPDATE customers
        SET name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE id=$5`,
            [name, phone, cpf, birthday, id]
        );
        res.sendStatus(200);
    } catch (error) {
        console.error(error.message);
        res.sendStatus(500);
    }
}