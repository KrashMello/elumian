import {
	Service,
	ValidateQuery,
	ValidateParams,
	ValidateBody,
	Middleware,
	Module,
	Post,
	Get,
	Public,
	Controller,
} from "elumian/common";
import { validationsOptions } from "elumian/type";
import { HttpExceptions, HttpStatus } from "elumian/common";
import { Elumian, Server } from "elumian/core";

const bodyDataValidate: validationsOptions = {
	fecha: ["required", "date"],
	algo: ["numeric"],
};

@Service()
class User {
	getUser() {
		return "user";
	}
}

@Service()
class Personas {
	constructor(private user: User) {}
	async message(): Promise<{
		status: HttpStatus;
		message: any;
		type: "INFO" | "SUCCESS" | "DANGER" | "WARNING";
	}> {
		console.log(Elumian.User.getUser());
		return {
			status: HttpStatus.ok,
			message: this.user.getUser(),
			type: "INFO",
		};
	}
}
@Middleware
class GlobalGuard {
	init(context) {
		const { handler } = context;
		const isPublic = Reflect.getMetadata("isPublic", handler);
		if (isPublic) return true;
		else
			HttpExceptions({
				status: HttpStatus.forbidden,
				message: "No tienes permisos para acceder a esta ruta",
				type: "DANGER",
			});
		return false;
	}
}
@Controller("test")
class Test {
	constructor(private personas: Personas) {}
	@Get("/")
	@Public
	async test(req, res) {
		HttpExceptions(await this.personas.message());
	}
	@Post("/us/1")
	@Public
	@ValidateBody(bodyDataValidate)
	@ValidateQuery(bodyDataValidate)
	test1(req, res) {
		HttpExceptions({
			status: HttpStatus.ok,
			message: { test: "test" },
			type: "SUCCESS",
		});
	}
	@Post("/:id")
	@ValidateParams(bodyDataValidate)
	@ValidateBody(bodyDataValidate)
	test2(req, res) {
		HttpExceptions({
			status: HttpStatus.ok,
			message: { test: "test" },
			type: "SUCCESS",
		});
	}
}
@Module({
	controllers: [Test],
	services: [Personas],
	middlewares: [GlobalGuard],
})
class asdf {}
Server.setConfig({ port: 5000 });
Server.chargeModules([asdf]);
Server.start();
