import { Router } from "express"
import { allGames, newGame } from "../controllers/games.js"
import validateMiddleware from "../middlewares/validateMiddleware.js"
import gamesSchema from "../schemas/gamesSchema.js"

const gamesRouter = Router()

gamesRouter.get('/games', allGames)
gamesRouter.post('/games', validateMiddleware(gamesSchema), newGame)

export default gamesRouter