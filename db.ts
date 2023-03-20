import * as  mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()
export const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
})


export const connectToDB = ()=>{

connection.connect(function (err: any) {
  if (err) throw err
  console.log('Connected!')
})

}