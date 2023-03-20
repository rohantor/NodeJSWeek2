import { connection } from "./db"

export const dropDb = (databaseName: string) => {
  connection.query(
    `drop  database ${databaseName};`,
    (errors, results, fields) => {
     if(errors){
     return errors
      console.log('error' + errors)
     return
     }
      console.log('results' + results)
      console.log('fields' + fields)
    }
  )
}
