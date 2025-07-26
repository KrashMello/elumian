import { validations } from "elumian/common/request";
console.log(
	validations.compareData(
		{
			username: "krashmello",
			password: "1234",
			email: "krashmello@gmail.com",
		},
		{
			username: ["alpha", "min:3", "max:20"],
			password: ["alphaNumeric", "min:6", "max:20"],
			email: ["email"],
		},
	),
);
