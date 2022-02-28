import categoriesSchema from "../schemas/categoriesSchema.js"

export default function categoriesValidateMiddleware(req, res, next) {
    const user = req.boby

    console.log(req.boby)

    const validation = categoriesSchema.validate(user)

    console.log('aqui 1')
    
    if(validation.error) {
        res.sendStatus(400)
        console.log('aqui 3')
        return
    }

    next()
}