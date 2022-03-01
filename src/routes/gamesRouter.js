import { Router } from "express"
import { allGames, newGame } from "../controllers/games.js"

const gamesRouter = Router()

gamesRouter.get('/games', allGames)
gamesRouter.post('/games', newGame)

export default gamesRouter