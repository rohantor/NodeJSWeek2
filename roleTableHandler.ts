import { ExecuteQuery } from './userTableHandler'
import { ServerResponse, IncomingMessage } from 'http'
import { ParsedUrlQuery } from 'querystring'
export const updateRolePUT = (res: ServerResponse<IncomingMessage>, body: string) => {
  try {
    const bodyObj = JSON.parse(body)
    const { name, createdAt, createdBy, updatedAt, updatedBy, id } = bodyObj
    if (!(name && createdAt && createdBy && updatedAt && updatedBy && id)) {
      res.writeHead(400) //Bad Request
      throw new Error('parameters are  missing')
      return
    }
    const query = `update role  set name = "${name}" ,createdAt = "${createdAt}", createdBy = "${createdBy}" , updatedAt = "${updatedAt}" ,updatedBy = ${updatedBy} where id  = ${id};`

    ExecuteQuery(res, query)
  } catch (error) {
    res.write('error:' + error)
    res.end()
  }
}
export const updateRolePATCH = (res: ServerResponse<IncomingMessage>, body: string) => {
  try {
    const bodyObj = JSON.parse(body)
    const { id } = bodyObj
    if (id === undefined) {
      res.writeHead(400) //Bad Request
      throw new Error('id is   missing')
    }
    delete bodyObj.id
    let query = 'update role  set'
    const lastOfQuery = `  where id  = ${id};`

    const updateKeys = Object.keys(bodyObj)

    updateKeys.forEach((key, index) => {
      let tempQuery =
        ' ' +
        key +
        '=' +
        (typeof bodyObj[key] === 'string' ? '"' : '') +
        bodyObj[key] +
        (typeof bodyObj[key] === 'string' ? '"' : '')
      if (updateKeys.length - 1 !== index) {
        tempQuery = tempQuery + ','
      }
      query += tempQuery
    })
    query += lastOfQuery
    ExecuteQuery(res, query)
  } catch (error) {
    res.write('error:' + error)
    res.end()
  }
}
export const getAllRole = (
  res: ServerResponse<IncomingMessage>,
  query: ParsedUrlQuery
) => {
  let queryString = 'select * from role'

  if (query.id && Object.keys(query).length === 1) {
    roleGET_BY_ID(res, query)
    return
  }
  ExecuteQuery(res, queryString)
}
export const roleGET_BY_ID = (
  res: ServerResponse<IncomingMessage>,
  query: ParsedUrlQuery
) => {
  let queryString = 'select * from role where id = ' + query.id + ';'
  ExecuteQuery(res, queryString)
}
export const insertIntoRole = (
  res: ServerResponse<IncomingMessage>,
  body: string
) => {

 try {
  


  const bodyObj = JSON.parse(body)
  const { name, createdAt, createdBy, updatedAt, updatedBy } = bodyObj
  let queryString = `insert into role (name, createdAt, createdBy, updatedAt, updatedBy) values ("${name}","${createdAt}",${createdBy},"${createdAt}",${updatedBy});`
  
  if (
   !(
    name !== undefined &&
    createdAt !== undefined &&
    createdBy !== undefined &&
    updatedAt !== undefined &&
    updatedBy !== undefined
    )
    ) {
     res.writeHead(400) //Bad Request
     throw new Error('parameters are  missing')
     return
    }
    
    ExecuteQuery(res, queryString)
   } catch (error) {
     res.write('error:' + error)
     res.end()
   }
}
