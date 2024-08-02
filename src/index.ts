import { PrismaClient } from "@prisma/client";
import "reflect-metadata";

export const Elumian: Record<string, any> = {
  prisma: new PrismaClient(),
};

export function Modules(services: any[]) {
  services.forEach((v) => {
    const service = new v();
    const prefix = Reflect.getMetadata("prefix", v);
    if (!Elumian[prefix]) Elumian[prefix] = service;
  });
}
import * as fs from "fs";

export function Generate(services) {
  services.forEach((v) => {
    const service = new v();
    const prefix = Reflect.getMetadata("prefix", v);
    if (!Elumian[prefix]) Elumian[prefix] = service;
  });
  // Ruta del archivo que deseas editar
  const filePath = __dirname + "/type.d.ts";

  // Leer el contenido del archivo
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return;
    }
    function getTypeDefinition(value) {
      if (Array.isArray(value)) {
        return `${value.length > 0 ? getTypeDefinition(value[0]) : "any"}[]`;
      } else if (typeof value === "object") {
        return `{\n${Object.entries(value)
          .map(([key, val]) => `${key}: ${getTypeDefinition(val)};`)
          .join("\n")}
    }`;
      } else {
        return typeof value;
      }
    }

    // Modificar el contenido
    const modifiedData =
      data +
      "\n" +
      `interface Elumian  {\n${Object.entries(Elumian)
        .map(([key, value]) => {
          const valueType = typeof Elumian;
          return `${key} : ${valueType === "object" ? getTypeDefinition(value) : valueType}\n`;
        })
        .join("")}\n}`;

    // Guardar los cambios en el archivo
    fs.writeFile(filePath, modifiedData, (err) => {
      if (err) {
        console.error("Error al escribir en el archivo:", err);
        return;
      }
      console.log("Archivo editado exitosamente.");
    });
  });
}
