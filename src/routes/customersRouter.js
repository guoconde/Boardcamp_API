import { Router } from "express"
import { allCustomers, newCustomer } from "../controllers/customers.js"

const customersRouter = Router()

customersRouter.get('/customers', allCustomers)
customersRouter.post('/customers', newCustomer)

export default customersRouter