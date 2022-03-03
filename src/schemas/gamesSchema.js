import joi from 'joi'

const gamesSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().integer().positive().min(1).required(),
    categoryId: joi.number().min(1).positive().required(),
    pricePerDay: joi.number().min(1).positive().required()
})

export default gamesSchema