import Users from "#Models/users";
import Auth from "#Models/auth";
import { userRequestValidate } from "#Request/users";
import dbpg from "#Class/database";
import bcrypt from "bcrypt";

const DB = new dbpg();
const user = new Users();
const auth = new Auth();

auth.singIn(async (req, response) => {
  let validate = userRequestValidate.getResult(req.query);
  if (validate.status === "ok") {
    let ip = req.header("x-forwarded-for") || req.ip;
    let userData;
    // search the existen of user

    userData = await user.findOne(req.query.username).then((res) => {
      return res;
    });
    if (userData === undefined)
      return response.status(401).json({ message: "User not found" });
    // comparing password
    let passwordIsValid = bcrypt.compareSync(
      req.query.password,
      userData.password
    );
    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
      return response.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    } else {
      return response.status(200).json("todo correcto");
    }
  } else if (validate.status === "error") {
    response.json(validate);
  }
});

export default auth.router();
