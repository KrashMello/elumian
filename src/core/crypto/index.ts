import * as crypto from "crypto";
const SECRET_KEY: string = process.env.eln_SECRET_KEY ?? "secretKey";

const ALGORITHM: string = "aes-256-cbc";
const SECRET_KEY_BUFFER: crypto.CipherKey = Buffer.alloc(
	32,
	SECRET_KEY,
	"utf8",
);
const IV: Buffer = crypto.randomBytes(16);
const TIMER_ENCODE = {
	1: "cgtzG1lTxwn8Ha",
	2: "jS1ycnzt6DFVPK",
	3: "GUcAT5SGpG5CPj",
	4: "jyqs88DO3iSyjo",
};
/*
 * Generates a random string of characters.
 * @param max - The maximum length of the string.
 * @returns The generated string.
 */
export const codeGen = (max: number = 32): string => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*/_";
	let result = "km-";
	const charLength = chars.length;
	for (let i = 0; i < max - result.length; i++) {
		if (i % 15 === 0) result += "/";
		else {
			const randomIndex = Math.floor(Math.random() * charLength);
			result += chars.charAt(randomIndex);
		}
	}
	return result;
};

export const encrypted = (data: object, unsafe: boolean = false): string => {
	const plainText: string = JSON.stringify(data);
	let iv = IV;
	if (unsafe) iv = Buffer.alloc(16, SECRET_KEY, "utf8");
	const cipher: crypto.Cipheriv = crypto.createCipheriv(
		ALGORITHM,
		SECRET_KEY_BUFFER,
		iv,
	);
	return cipher.update(plainText, "utf8", "hex") + cipher.final("hex");
};

export const encryptedBase64 = (
	text: string,
	unsafe: boolean = false,
): string => {
	let iv = IV;
	if (unsafe) iv = Buffer.alloc(16, SECRET_KEY, "utf8");
	const cipher: crypto.Cipheriv = crypto.createCipheriv(
		ALGORITHM,
		SECRET_KEY_BUFFER,
		iv,
	);
	let encrypted = Buffer.concat([cipher.update(text), cipher.final()]).toString(
		"base64",
	);

	return encrypted;
};

export const decrypt = (
	data: string,
	unsafe: boolean = false,
): Record<string, any> => {
	let iv = IV;
	if (unsafe) iv = Buffer.alloc(16, SECRET_KEY, "utf8");
	const decipher: crypto.Decipheriv = crypto.createDecipheriv(
		ALGORITHM,
		SECRET_KEY,
		iv,
	);
	const decryptedText: string =
		decipher.update(data, "hex", "utf8") + decipher.final("utf8");
	return JSON.parse(decryptedText);
};

export const decryptBase64 = (
	text: string,
	unsafe: boolean = false,
): string => {
	let iv = IV;
	if (unsafe) iv = Buffer.alloc(16, SECRET_KEY, "utf8");
	const encryptedText = Buffer.from(text, "base64");
	const decipher: crypto.Decipheriv = crypto.createDecipheriv(
		ALGORITHM,
		SECRET_KEY,
		iv,
	);
	return Buffer.concat([
		decipher.update(encryptedText),
		decipher.final(),
	]).toString();
};

export const hardEncrypt = (data: object, unsafe: boolean = false): string => {
	const time = Math.floor(Math.random() * 4) + 1;

	let encryptText = encrypted(data, unsafe);
	for (let i = 0; i < time; i++) {
		encryptText = encryptedBase64(encryptText, unsafe);
	}
	return `${TIMER_ENCODE[time]}.${encryptText}`;
};

export const hardDecrypt = (
	data: string,
	unsafe: boolean = false,
): Record<string, any> => {
	const [Stime, encryptText] = data.split(".");
	const time = Number(
		Object.entries(TIMER_ENCODE).find((v) => v[1] === Stime)[0],
	);
	let decryptText = encryptText;
	for (let i = 0; i < time; i++) {
		decryptText = decryptBase64(decryptText, unsafe);
	}
	return decrypt(decryptText, unsafe);
};
