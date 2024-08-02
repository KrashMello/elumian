import modules from "./modules/index";
import server from "@elumian/server/index";
const whiteList = ["http://localhost:3000"];
server({
  controllers: modules.controllers,
  services: modules.services,
  port: 5000,
});
