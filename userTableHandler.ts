import { ServerResponse, IncomingMessage } from 'http'
import { connection } from './db'
import { QueryOptions } from 'mysql'
import { ParsedUrlQuery } from 'querystring'

interface insertIntoRoleBody {
  username: string
  password: string
  roleid: number
  createdAt: string
  updatedAt: string
  createdBy: number
  updatedBy: number
}
const getStatusCodes = (err: string) => {
  switch (err) {
    case 'ER_DUP_ENTRY':
      return 406
      break
    case 'temp':
      return 422
      break
    default:
      return 500
  }
}
export interface ResponseObject {
  isError: boolean
  error?: string
}
export const ExecuteQuery = (
  res: ServerResponse<IncomingMessage>,
  query: string | QueryOptions
) => {
  connection.query(query, (errors, results, fields) => {
    if (errors) {
      console.log('error' + JSON.stringify(errors, null, 2))
      res.writeHead(getStatusCodes(errors.code))

      res.write(JSON.stringify('Error ' + errors.sqlMessage))
      res.end()
    } else {
      res.write(JSON.stringify(results))

      res.end()
    }
  })
}
//get
export const getPagination = (
  res: ServerResponse<IncomingMessage>,
  limit: string,
  page: string
) => {
  const offset = parseInt(limit) * (parseInt(page) ? parseInt(page) - 1 : 0)
  const query = 'select * from user LIMIT ' + limit + ' OFFSET ' + offset + ' ;'
  ExecuteQuery(res, query)
}

//get
export const getAllUsers = (
  res: ServerResponse<IncomingMessage>,
  query: ParsedUrlQuery
) => {
  // let queryString = 'select id,username,roleid ,createdAt,updatedAt,createdBy,updatedBy from user '
  let queryString =
    'select u.id ,u.username,r.name as role,u.createdAt,u.updatedAt,u1.username as createdBy , u2.username as updatedBy from user as u inner join  role as r on u.roleid = r.id inner join user as u1 on u.createdBy =u1.id inner join user as u2 on u.updatedBy = u2.id'
  const QueryKeys = Object.keys(query)
  if (QueryKeys.includes('id')) {
    getByUserId(res, query.id)
    return
  }
  if (QueryKeys.includes('order') && QueryKeys.includes('orderCol')) {
    // console.log('QueryKeys', QueryKeys)
    queryString += ' ORDER BY ' + query.orderCol + ' ' + query.order
  }
  if (QueryKeys.includes('limit')) {
    queryString += ' limit ' + query.limit
    if (QueryKeys.includes('offset')) {
      queryString += ' OFFSET ' + query.offset
    }
  }
  console.log(Object.entries(query))
  console.log(queryString)
  queryString += ' ;'
  ExecuteQuery(res, queryString)
  // res.end()
}
//get
export const getByUserId = (
  res: ServerResponse<IncomingMessage>,
  id: string | string[] | undefined
) => {
  const query =
    'select u.id ,u.username,r.name as role ,u.createdAt,u.updatedAt,u1.username as createdBy , u2.username as updatedBy from user as u inner join  role as r on u.roleid = r.id inner join user as u1 on u.createdBy =u1.id inner join user as u2 on u.updatedBy = u2.id where u.id =' +
    id +
    ';'
  ExecuteQuery(res, query)
}

//POST
export const insertIntoUser = (
  res: ServerResponse<IncomingMessage>,
  body: string
) => {
  try {
    const bodyObj = JSON.parse(body)
    const {
      username,
      password,
      roleid,
      createdAt,
      updatedAt,
      createdBy,
      updatedBy,
    } = bodyObj

    const query = `insert into user (username,password,roleid,createdAt ,updatedAt , createdBy ,updatedBy )
 values("${username}","${password}",${roleid},"${createdAt}","${updatedAt}",${createdBy},${updatedBy});`
    if (
      !(
        username !== undefined &&
        password !== undefined &&
        roleid !== undefined &&
        createdAt !== undefined &&
        updatedAt !== undefined &&
        createdBy !== undefined &&
        updatedBy !== undefined
      )
    ) {
      res.writeHead(400) //Bad Request
      throw new Error('parameters are  missing')
      return
    }
    ExecuteQuery(res, query)
  } catch (error) {
    res.write('error: Invalid JSON format')
    res.end()
  }
}

// Put Request

export const updateUserPUT = (
  res: ServerResponse<IncomingMessage>,
  body: string
) => {
  try {
    console.log(body)
    const bodyObj = JSON.parse(body)
    const { username, password, roleid, id, updatedAt, updatedBy } = bodyObj

    if (!(username && password && roleid && id && updatedAt && updatedBy)) {
      res.writeHead(400) //Bad Request
      throw new Error('parameters are  missing')
      return
    }

    const query = `update user  set username = "${username}" ,roleid = ${roleid}, password = "${password}" , updatedAt = "${updatedAt}" ,updatedBy = ${updatedBy} where id  = ${id};`

    ExecuteQuery(res, query)
  } catch (error) {
    res.write('error:' + error)
    res.end()
  }
}

//Patch
export const updateUserPATCH = (
  res: ServerResponse<IncomingMessage>,
  body: string
) => {
  try {
    const bodyObj = JSON.parse(body)
    const { id } = bodyObj
    if (id === undefined) {
      res.writeHead(400) //Bad Request
      throw new Error('id is   missing')
    }
    delete bodyObj.id
    let query = 'update user  set'
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
