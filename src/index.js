import express, { json } from "express"
import cors from "cors"
import { userInfo } from "os";

const app = express()

app.use(cors())
app.use(json())

app.listen(4000, () => { console.log('Server listening on PORT 4000')})