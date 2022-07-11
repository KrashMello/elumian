import Users from "#Models/users";
import { userRequestValidate } from "#Request/users";
import dbpg from "#Class/database";

const DB = new dbpg();
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
  response.json("created user");
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
