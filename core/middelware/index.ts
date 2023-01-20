import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { RequestJWT } from "./types";
const JWT_TOKEN: string = process.env.JWT_TOKEN
  ? process.env.JWT_TOKEN
  : "token jwt";
function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("x-access-token")?.replace("Bearer ", "");
    // let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }
    const decoded = jwt.verify(token, JWT_TOKEN);
    (req as RequestJWT).userId = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      message: "Unauthorized!",
    });
  }
  return null;
}
export default verifyToken;
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
