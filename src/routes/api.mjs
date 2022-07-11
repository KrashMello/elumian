import users from "#Controller/users";
import auth from "#Controller/auth";

export function routes(app) {
  app.use("/Users", users);
  app.use("/Auth", auth);
}
