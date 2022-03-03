export default function validateMiddleware(schema) {
    return (req, res, next) => {
        const user = req.body
        
        const validation = schema.validate(user)
        
        if(validation.error) {
            res.sendStatus(400)
            return
        }
        
        next()
    }
}