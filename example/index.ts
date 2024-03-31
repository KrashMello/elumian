import modules from "../example/modules/index";
import server from "@elumian/server/index";
const whiteList = ["http://localhost:3000"];

server({
  controllers: modules.controllers,
  services: modules.services,
  port: Number(process.env.SERVER_PORT),
});
