import express from 'express'
import os from 'os'
import 'dotenv/config'
import routes from './routes'

const app = express()
app.use(express.json())

routes

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `server active in port: http://${os.hostname}:${process.env.SERVER_PORT}`
  )
})
