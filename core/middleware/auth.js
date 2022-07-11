import { Jwt } from "jsonwebtoken";

//auth

const verifyToken = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send("requiere un token para authorization");
  }
  try {
    const decode = Jwt.verifyToken(token, process.env.JWT_TOKEN);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send("token invalido");
  }
  return next();
};

module.exports = verifyToken;
