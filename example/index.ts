import { controllers } from '@src/routes/index'
import server from '@server/index'

const whitelist = ['http://localhost:3000']

server(controllers, whitelist, Number(process.env.SERVER_PORT))
