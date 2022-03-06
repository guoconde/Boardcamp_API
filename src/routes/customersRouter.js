import { Router } from "express"
import { allCustomers, newCustomer, selectedCustomer } from "../controllers/customers.js"
import validateMiddleware from "../middlewares/validateMiddleware.js"
import customersSchema from "../schemas/customersSchema.js"

const customersRouter = Router()

customersRouter.get('/customers', allCustomers)
customersRouter.post('/customers', validateMiddleware(customersSchema), newCustomer)
customersRouter.get('/customers/:id', selectedCustomer)

export default customersRouter