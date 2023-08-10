import express from 'express'
import os from 'os'
import 'dotenv/config'
import { router } from '@router/index'
import { controllers } from './routes'

const app = express()
app.use(express.json())

router(controllers)
const hostname = os.hostname()
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `server active in port: http://${hostname}:${process.env.SERVER_PORT as string}`
  )
})


