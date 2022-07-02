import users from "#Controller/users";

export function routes(app){
    app.use("/Users", users);
}