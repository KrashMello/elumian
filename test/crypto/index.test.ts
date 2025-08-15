import { Elumian } from "elumian/core";
let encrypted = Elumian.crypto.hardEncrypt({ id: 1, name: "asd" });
console.log(encrypted);
console.log(Elumian.crypto.hardDecrypt(encrypted));
console.log(
	Elumian.crypto.hardDecrypt(
		"cgtzG1lTxwn8Ha.ijxJ5Ohx6sL1/DdAReuWB/1u264zhb/iBYoVoTdrwHDINWBZKEKrCwyzEC/XL9RZO7xVcxHuy2HQOpaAWONaZUA1B33dmTeU2fqsJw8snmE=",
		true,
	),
);
