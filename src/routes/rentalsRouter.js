import { Router } from "express"
import { allRentals } from "../controllers/rentals.js"

const rentalsRouter = Router()

rentalsRouter.get('/rentals', allRentals)

export default rentalsRouter