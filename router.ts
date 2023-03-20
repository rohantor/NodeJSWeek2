import * as http from 'http'
import * as url from 'url'
import {
  getAllUsers,
  getByUserId,
  getPagination,
  insertIntoUser,
  updateUserPATCH,
  updateUserPUT,
} from './userTableHandler'
import { getAllRole, insertIntoRole, updateRolePATCH, updateRolePUT } from './roleTableHandler'

export const router = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  body: string
) => {
  const { pathname, query } = url.parse(req.url || '', true)

  if (req.method?.toLowerCase() === 'post') {
    if (req.url === '/user') {
      insertIntoUser(res, body)
    } else if (req.url === '/role') {
      insertIntoRole(res, body)
    }
  } else if (req.method?.toLowerCase() === 'put') {
    if (req.url === '/user') {
      updateUserPUT(res, body)
    } else {
      updateRolePUT(res, body)
    }
  } else if (req.method?.toLowerCase() === 'patch') {
    if (req.url === '/user') {
      updateUserPATCH(res, body)
    }else{
      updateRolePATCH(res,body)
    }
  } else if (req.method?.toLowerCase() === 'get') {
    if (pathname?.startsWith('/user')) {
      getAllUsers(res, query)
    } else if (pathname?.startsWith('/role')) {
      getAllRole(res, query)
    }
  }
}
// if (JSON.stringify(query) === '{}') {

//   getAllUsers(res)
// } else if (query.id) {

//   getByUserId(res, query.id)
// } else if (
//   Object.keys(query).includes('page') &&
//   Object.keys(query).includes('limit')
// ) {
//   const limit: string = query.limit as string
//   const page: string = query.page as string

//   getPagination(res, limit, page)
// }
// console.log(Object.keys(query))
