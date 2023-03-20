import * as http from 'http'
import dotenv from 'dotenv'
import { connectToDB } from './db'
import { router } from './router'
import { bodyExtractor } from './helper'

dotenv.config()

const server = http.createServer()

server.on('request', async(req: http.IncomingMessage, res: http.ServerResponse) => {
  const body = await bodyExtractor(req)
 
  router(req, res ,body)

})
server.listen(process.env.PORT, () => {
  console.log(`Server is listening on ${process.env.PORT}`)
})
connectToDB()
