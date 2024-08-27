# Elumian

==================

Elumian is a library for back end developers to deploy an api rest quickly and securely.

# Installation and Usage

==================

Install the `Elumian` package:

```sh
npm i Elumian
yarn add Elumian
```

# Typescript

## index.ts

```typescript
import modules from "./modules/index";
import { server } from "elumian/server";
const whiteList = ["http://localhost:3000"];
server({
  controllers: modules.controllers,
  services: modules.services,
  port: 5000,
});
```

## modules/index.ts

```typescript
import { AuthController } from "../controllers/auth/auth.controller";
import { Auth } from "../services/auth.service";

export default {
  controllers: [AuthController],
  services: [Auth],
};
```

## services/auth.service.ts

```typescript
import { Service } from "elumian/core/decorators";
import { Elumian } from "elumian/core";
import bcrypt from "bcrypt";

@Service
export class Auth {
  async login(data: { username: string; password: string }) {
    const sessionActive = Elumian.cache.list.Auth.map((v) => {
      return Elumian.crypto.hardDecrypt(v.data).username;
    }).filter((v) => v === data.username)[0];
    if (sessionActive) {
      return { type: "warning", message: "Ya hay una sesion activa" };
    }
    const userData = await Elumian.prisma.users.findUnique({
      select: {
        id: true,
        username: true,
        password: true,
      },
      where: {
        username: data.username,
      },
    });
    if (userData) {
      const comparePassword = bcrypt.compareSync(
        data.password,
        userData.password,
      );

      if (comparePassword) {
        delete userData.password;

        return Elumian.cache.singCacheData({
          key: "Auth",
          data: userData,
          encrypted: true,
          expire: true,
        });
      } else {
        return { type: "warning", message: "Contraseña invalida" };
      }
    } else {
      return { type: "warning", message: "nombre de usuario invalido" };
    }
  }
}
```

## controllers/auth/auth.controller.ts

```typescript
import {
  Controller,
  Post,
  DataEntryGuard,
  CatchErrors,
} from "elumian/core/decorators";
import { type Request, type Response } from "express";
import { loginDataRequest } from "./auth.request";
import { Elumian } from "elumian/core";

@Controller("/auth")
export class AuthController {
  @Post("/login")
  @DataEntryGuard(loginDataRequest)
  @CatchErrors
  async login(req: Request, res: Response): Promise<any> {
    const data = req.body;
    res.json(await Elumian.Auth.login(data));
  }
}
```

## controller/auth/auth.request.ts

```typescript
import { validationsOptions } from "elumian/core/request";

const loginDataOptions: validationsOptions = {
  username: ["alphaNumeric", "required"],
  password: ["alphaNumericSimbols", "required"],
};

export const loginDataRequest = {
  options: loginDataOptions,
};
```
