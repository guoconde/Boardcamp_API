import { Router } from "express"
import { allCategories, newCategory } from "../controllers/categories.js"
import validateMiddleware from "../middlewares/validateMiddleware.js"
import categoriesSchema from "../schemas/categoriesSchema.js"

const categoriesRouter = Router()

categoriesRouter.get('/categories', allCategories)
categoriesRouter.post('/categories', validateMiddleware(categoriesSchema), newCategory)

export default categoriesRouter
