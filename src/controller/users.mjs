import { Users } from "#Models/users";
import { userRequestValidate } from "#Request/usersRequest";
import DB from "#Class/database";

const user = new Users();

/**
 * metodo optener usuario
 *
 *
 */
user.get((_req, res) => {
    res.send("getter all user");
});

/**
 * metodo mostrar detalles del usuario
 *
 *
 */
user.showDetails((_req, res) => {
    res.type("json").json({ name: "joel", nickname: "krashmello" });
});

/**
 * metodo crear usuario
 *
 *
 */
user.created(async (_req, response) => {
    let validate = userRequestValidate.getResult(_req.query);
    if (validate.status === "ok") {
        let ip = _req.header("x-forwarded-for") || _req.ip;
        await DB.view().then((res) => response.json(res.rows));
    } else if (validate.status === "error") {
        response.json(validate);
    }
});

/**
 * metodo Actualizar usuario
 *
 *
 */
user.updated(async (_req, res) => {
    await res.json("update an user");
});

/**
 * metodo Eiminar usuario
 *
 *
 */
user.delete(async (_req, res) => {
    await res.json("delete an user");
});
export default user.router();
