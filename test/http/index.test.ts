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

@Controller("test")
class test {
	@Get("/")
	@Public
	@ValidateQuery(bodyDataValidate)
	async test(req, res) {
		HttpExceptions(await Elumian.persona.message());
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
@Service
class persona {
	data = {
		nombre: "asdf",
	};
	async message() {
		return {
			status: HttpStatus.ok,
			message: this.data,
			type: "SUCCESS",
		};
	}
}
@Middleware
class GlobalGuard {
	init(context) {
		const isPublic = Reflect.getMetadata("isPublic", context);
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
@Module({
	controllers: [test],
	services: [persona],
})
class asdf {}
@Controller("test2")
class test2 {
	@Post("/")
	test(req, res) {
		HttpExceptions(Elumian.persona.message());
	}
	@Post("/us/1")
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
	controllers: [test2],
})
class asdf2 {}
Server.setConfig({ port: 5000 });
Server.chargeModules([asdf, asdf2]);
Server.start();
