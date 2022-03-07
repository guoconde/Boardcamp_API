import { Router } from "express"
import { allMetrics, allRentals, deleteRental, newRental, returnRental } from "../controllers/rentals.js"
import validateMiddleware from "../middlewares/validateMiddleware.js"
import rentalsSchema from "../schemas/rentalsSchema.js"

const rentalsRouter = Router()

rentalsRouter.get('/rentals', allRentals)
rentalsRouter.post('/rentals', validateMiddleware(rentalsSchema), newRental)
rentalsRouter.post('/rentals/:id/return', returnRental)
rentalsRouter.delete('/rentals/:id', deleteRental)
rentalsRouter.get('/rentals/metrics', allMetrics)

export default rentalsRouter