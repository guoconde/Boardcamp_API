import connection from "../db.js"

export async function allRentals(req, res) {

    try {
        
        const { rows: arrRentals } = await connection.query(`
            SELECT * FROM rentals
        `)

        res.send(arrRentals)
        
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}