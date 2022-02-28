import { Router } from "express"
import { allCategories } from "../controllers/categories.js"

const categoriesRouter = Router()

categoriesRouter.get('/categories', allCategories)

export default categoriesRouter
