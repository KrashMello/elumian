import { config } from "dotenv";
import { Jwt } from "jsonwebtoken";

const verifyToken = (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).send("requiere un token para authorization")
    }
    try {
        const decode = Jwt.verifyToken(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send("token invalido");
    }
    return next();
}

module.exports = verifyToken;