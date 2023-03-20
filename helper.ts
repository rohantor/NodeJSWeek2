import { IncomingMessage } from "http"

export const bodyExtractor =async(req: IncomingMessage)=>{
   const buffers:any = []
   for await (const chunk of req) {
     buffers.push(chunk)
   }
   const data = Buffer.concat(buffers).toString()
   return data
  
}