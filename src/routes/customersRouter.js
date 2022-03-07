import { Router } from "express"
import { allCustomers, newCustomer, selectedCustomer, updateCustomer } from "../controllers/customers.js"
import validateMiddleware from "../middlewares/validateMiddleware.js"
import customersSchema from "../schemas/customersSchema.js"

const customersRouter = Router()

customersRouter.get('/customers', allCustomers)
customersRouter.post('/customers', validateMiddleware(customersSchema), newCustomer)
customersRouter.get('/customers/:id', selectedCustomer)
customersRouter.put('/customers/:id', validateMiddleware(customersSchema), updateCustomer)

export default customersRouter