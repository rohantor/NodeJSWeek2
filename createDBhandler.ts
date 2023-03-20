import { connection } from './db'

export const createDb = (databaseName: string) => {
  connection.query(
    `create database ${databaseName};`,
    (errors, results, fields) => {

     console.log("error" + errors)
     console.log("results" + results)
     console.log('fields' + fields)
    }
  )
}
