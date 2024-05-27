import modules from "../example/modules/index";
import server from "@elumian/server";
const whiteList = ["http://localhost:3000"];

server({
  controllers: modules.controllers,
  services: modules.services,
  viewsDir: __dirname + "/views",
  port: 5000,
});
