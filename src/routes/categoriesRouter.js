import { Router } from "express"
import { allCategories, newCategory } from "../controllers/categories.js"
import categoriesValidateMiddleware from "../middlewares/categoriesValidateMiddleware.js"

const categoriesRouter = Router()

categoriesRouter.get('/categories', allCategories)
categoriesRouter.post('/categories', categoriesValidateMiddleware, newCategory)

export default categoriesRouter
