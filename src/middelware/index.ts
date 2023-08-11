import { type NextFunction, type Response, type Request } from 'express'
import { verifyId } from '@Cache/index'

function verifyToken(req: Request, res: Response, next: NextFunction): any {
  const id = req.header('x-access-id')

  if (id == null) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }
  if (verifyId('Auth', id) === false)
    return res.status(401).json({
      status: 1,
      message: 'Unauthorized!'
    })
  next()
}
export default verifyToken

