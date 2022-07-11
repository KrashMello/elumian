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
    let ip = req.header("x-forwarded-for") || _req.ip;
    let userData;
    console.log(req.query.username);
    // search the existen of user

    await user
      .findOne(req.query.username)
      .then((res) => {
        userData = res;
      })
      .catch((error) => {
        console.log(error);
      });
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
    }
  } else if (validate.status === "error") {
    response.json(validate);
  }
});

export default auth.router();
