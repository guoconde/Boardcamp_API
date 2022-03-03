import joi from "joi"

const rentalsSchema = joi.object({
    customerId: joi.number().positive().integer().min(1).required(),
    gameId: joi.number().positive().integer().min(1).required(),
    daysRented: joi.number().positive().integer().min(1).required()
})

export default rentalsSchema