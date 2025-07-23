# Documentación detallada de Elumian

## Descripción general

**Elumian** es un framework modular diseñado específicamente para desarrolladores backend que necesitan desplegar APIs REST de forma rápida, eficiente y segura. Proporciona una estructura clara y herramientas integradas para la creación de módulos, gestión de servicios, validación de datos y manejo de excepciones HTTP, facilitando el desarrollo escalable y mantenible.

## Instalación

Puedes instalar Elumian en tu proyecto utilizando cualquiera de los gestores de paquetes más populares de JavaScript:

- Con **npm**:

```sh
npm i Elumian
```

- Con **yarn**:

```sh
yarn add Elumian
```

- Con **pnpm**:

```sh
pnpm add Elumian
```

## Uso con TypeScript

Elumian está pensado para integrarse fácilmente con TypeScript, ofreciendo tipados claros y anotaciones que permiten un desarrollo más seguro y robusto.

### Definición de Módulos

Elumian utiliza decoradores para definir módulos que agrupan controladores, servicios y middlewares.

```typescript
import { Module } from "@elumian/common"

@Module({
  controllers: [TestController],
  services: [TestService],
  middlewares: [GlobalMiddleware]
})
class TestModule { }
```

- `controllers`: Lista de controladores que gestionan las rutas y peticiones.
- `services`: Servicios que manejan la lógica de negocio.
- `middlewares`: Middlewares globales para manejo transversal de peticiones.

### Definición de Servicios

Los servicios encapsulan la lógica reutilizable. Se definen también mediante decoradores.

```typescript
import { Service } from "@elumian/common"

@Service
class TestService {
  data = {
    nombre: "asdf"
  }

  getData() {
    return {
      status: HttpStatus.ok,
      message: this.data,
      type: 'SUCCESS'
    }
  }
}
```

- El método `getData()` retorna un objeto con un estado HTTP, datos y un tipo de respuesta.

### Creación de Controladores y Rutas

Los controladores usan decoradores para definir rutas HTTP y validaciones sobre diferentes partes de la solicitud.

```typescript
import { ValidateQuery, ValidateParams, ValidateBody, Post, Get, Controller } from "@elumian/common"
import { HttpExceptions, HttpStatus } from "@elumian/common"
import { bodyDataValidate } from "./dataValidateSchemas/bodyData.schema"

@Controller("test")
class TestController {
  @Get("/")
  getData(req, res) {
    HttpExceptions(Elumian.TestService.getData())
  }

  @Post("/test/1")
  @ValidateBody(bodyDataValidate)
  @ValidateQuery(bodyDataValidate)
  test1(req, res) {
    HttpExceptions({
      status: HttpStatus.ok,
      message: { test: "test" },
      type: 'SUCCESS'
    })
  }

  @Post("/:id")
  @ValidateParams(bodyDataValidate)
  @ValidateBody(bodyDataValidate)
  test2(req, res) {
    HttpExceptions({
      status: HttpStatus.ok,
      message: { test: "test" },
      type: 'SUCCESS'
    })
  }
}
```

- `@Controller("test")`: Prefijo global para las rutas del controlador.
- `@Get()`, `@Post()`: Definición de métodos HTTP.
- `@ValidateBody`, `@ValidateQuery`, `@ValidateParams`: Validaciones aplicadas a diferentes partes de la solicitud basadas en esquemas.
- `HttpExceptions`: Maneja respuestas estandarizadas y excepciones HTTP.

### Definición de Esquemas de Validación

Los esquemas de validación definen reglas para los datos recibidos en las peticiones, utilizando las opciones de validación propias de Elumian.

```typescript
import { validationsOptions } from "@elumian/type"

export const bodyDataValidate: validationsOptions = {
  fecha: ['required', 'date'],
}
```

- En este ejemplo, el campo `fecha` es obligatorio y debe cumplir con el formato fecha.

## Inicialización y Arranque del Servidor

Para iniciar tu servidor Elumian, configura los módulos que quieres cargar y define el puerto de escucha. Posteriormente, inicia el servidor.

```typescript
import { Server } from "elumian/core";

Server.setConfig({ modules: [modulo1, modulo2], port: 5000 })
Server.start()
```

- `modules`: Array con los módulos que contiene la aplicación.
- `port`: Puerto en el que el servidor escuchará las peticiones entrantes.
