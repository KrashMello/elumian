import { type NextFunction, type Response, type Request } from 'express'
import { verifyId } from '@Cache/index'

function verifyToken (req: Request, res: Response, next: NextFunction): any {
  const id = req.header('x-access-id')

  if (id == null) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }

  if (verifyId('Auth', id)) next()
  else {
    return res.status(401).json({
      status: 1,
      message: 'Unauthorized!'
    })
  }

  return res.status(401).json({
    status: 1,
    message: 'Unauthorized!'
  })
}
export default verifyToken
// isAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "admin") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Admin Role!",
//       });
//       return;
//     });
//   });
// };
// isModerator = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "moderator") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Moderator Role!",
//       });
//     });
//   });
// };
// isModeratorOrAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "moderator") {
//           next();
//           return;
//         }
//         if (roles[i].name === "admin") {
//           next();
//           return;
//         }
//       }
//       res.status(403).send({
//         message: "Require Moderator or Admin Role!",
//       });
//     });
//   });
// };
