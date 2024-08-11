import { Service } from "@elumian/decorators";
import * as crypto from "crypto";

@Service
export class Crypto {
  private readonly secretKey: string =
    process.env.eln_SECRET_KEY ?? "secretKey";

  private readonly algorithm: string = "aes-256-cbc";
  private readonly secretKeyBuffer: Buffer = Buffer.alloc(
    32,
    this.secretKey,
    "utf8",
  );
  timerEncode = {
    1: "cgtzG1lTxwn8Ha",
    2: "jS1ycnzt6DFVPK",
    3: "GUcAT5SGpG5CPj",
    4: "jyqs88DO3iSyjo",
  };
  private readonly iv: Buffer = crypto.randomBytes(16);

  public encrypted(data: object): string {
    const plainText: string = JSON.stringify(data);
    const cipher: crypto.Cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKeyBuffer,
      this.iv,
    );
    return cipher.update(plainText, "utf8", "hex") + cipher.final("hex");
  }

  public encryptedBase64(text: string): string {
    const cipher: crypto.Cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKeyBuffer,
      this.iv,
    );
    let encrypted = Buffer.concat([
      cipher.update(text),
      cipher.final(),
    ]).toString("base64");

    return encrypted;
  }

  public decrypt(data: string): Record<string, any> {
    const decipher: crypto.Decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKeyBuffer,
      this.iv,
    );
    let decryptedText: string =
      decipher.update(data, "hex", "utf8") + decipher.final("utf8");
    return JSON.parse(decryptedText);
  }

  public decryptBase64(text: string): string {
    const encryptedText = Buffer.from(text, "base64");
    const decipher: crypto.Decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKeyBuffer,
      this.iv,
    );
    return Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]).toString();
  }

  hardEncrypt(data: object, time: number): string {
    let encryptText = this.encrypted(data);
    for (let i = 0; i < time; i++) {
      encryptText = this.encryptedBase64(encryptText);
    }
    return `${this.timerEncode[time]}.${encryptText}`;
  }

  hardDecrypt(data: string): Record<string, any> {
    let [Stime, encryptText] = data.split(".");
    const time = Number(
      Object.entries(this.timerEncode).find((v) => v[1] === Stime)[0],
    );
    let decryptText = encryptText;
    for (let i = 0; i < time; i++) {
      decryptText = this.decryptBase64(decryptText);
    }
    return this.decrypt(decryptText);
  }
}
// let eln = new Eluncoder()
// let time = Math.floor(Math.random() * 10) + 1
// console.log(time)
// let encrypted = eln.hardEncryptor({ id: 1, name: 'asd' }, time)
// console.log(encrypted)
// console.log(eln.hardDecrypt(encrypted))
