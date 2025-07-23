import * as crypto from "crypto";

const secretKey: string = process.env.eln_SECRET_KEY ?? "secretKey";

const algorithm: string = "aes-256-cbc";
const secretKeyBuffer: Buffer = Buffer.alloc(32, secretKey, "utf8");
const timerEncode = {
  1: "cgtzG1lTxwn8Ha",
  2: "jS1ycnzt6DFVPK",
  3: "GUcAT5SGpG5CPj",
  4: "jyqs88DO3iSyjo",
};
const iv: Buffer = crypto.randomBytes(16);

export const encrypted = (data: object): string => {
  const plainText: string = JSON.stringify(data);
  const cipher: crypto.Cipheriv = crypto.createCipheriv(
    algorithm,
    secretKeyBuffer,
    iv,
  );
  return cipher.update(plainText, "utf8", "hex") + cipher.final("hex");
};

export const encryptedBase64 = (text: string): string => {
  const cipher: crypto.Cipheriv = crypto.createCipheriv(
    algorithm,
    secretKeyBuffer,
    iv,
  );
  let encrypted = Buffer.concat([cipher.update(text), cipher.final()]).toString(
    "base64",
  );

  return encrypted;
};

export const decrypt = (data: string): Record<string, any> => {
  const decipher: crypto.Decipheriv = crypto.createDecipheriv(
    algorithm,
    secretKeyBuffer,
    iv,
  );
  let decryptedText: string =
    decipher.update(data, "hex", "utf8") + decipher.final("utf8");
  return JSON.parse(decryptedText);
};

export const decryptBase64 = (text: string): string => {
  const encryptedText = Buffer.from(text, "base64");
  const decipher: crypto.Decipheriv = crypto.createDecipheriv(
    algorithm,
    secretKeyBuffer,
    iv,
  );
  return Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]).toString();
};

export const hardEncrypt = (data: object, time: number): string => {
  let encryptText = encrypted(data);
  for (let i = 0; i < time; i++) {
    encryptText = encryptedBase64(encryptText);
  }
  return `${timerEncode[time]}.${encryptText}`;
};

export const hardDecrypt = (data: string): Record<string, any> => {
  let [Stime, encryptText] = data.split(".");
  const time = Number(
    Object.entries(timerEncode).find((v) => v[1] === Stime)[0],
  );
  let decryptText = encryptText;
  for (let i = 0; i < time; i++) {
    decryptText = decryptBase64(decryptText);
  }
  return decrypt(decryptText);
};
export default {
  encrypted,
  encryptedBase64,
  decrypt,
  decryptBase64,
  hardEncrypt,
  hardDecrypt,
};
