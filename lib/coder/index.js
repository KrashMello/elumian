"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoder = void 0;
const crypto = __importStar(require("crypto"));
class Encoder {
    constructor() {
        var _a;
        // Define la clave secreta
        this.secretKey = (_a = process.env.eln_SECRET_KEY) !== null && _a !== void 0 ? _a : 'secretKey';
        // Define el tipo de algoritmo
        this.algorithm = 'aes-256-cbc';
        // Convierte la clave secreta a un buffer
        this.secretKeyBuffer = Buffer.alloc(32, this.secretKey, 'utf8');
        // Crea un vector de inicialización aleatorio
        this.iv = crypto.randomBytes(16);
    }
    encrypted(data) {
        // Convierte el objeto a una cadena JSON
        const plainText = JSON.stringify(data);
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKeyBuffer, this.iv);
        let cipherText = cipher.update(plainText, 'utf8', 'hex');
        cipherText += cipher.final('hex');
        return cipherText;
    }
    encryptedBase64(text) {
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKeyBuffer, this.iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('base64');
    }
    decrypt(data) {
        // Descifra los datos con la clave secreta y los parámetros del algoritmo
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKeyBuffer, this.iv);
        let decryptedText = decipher.update(data, 'hex', 'utf8');
        decryptedText += decipher.final('utf8');
        const decryptedObject = JSON.parse(decryptedText);
        return decryptedObject;
    }
    decryptBase64(text) {
        // Descifra los datos con la clave secreta y los parámetros del algoritmo
        const encryptedText = Buffer.from(text, 'base64');
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKeyBuffer, this.iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    hardEncrypter(data, time) {
        let encryptText = this.encrypted(data);
        for (let i = 0; i < time; i++) {
            encryptText = this.encryptedBase64(encryptText);
        }
        return `${time}.${encryptText}`;
    }
    hardDecrypt(data) {
        var _a;
        let [Stime, encryptText] = data.split('.');
        encryptText = encryptText !== null && encryptText !== void 0 ? encryptText : '';
        const time = (_a = Number(Stime)) !== null && _a !== void 0 ? _a : 1;
        for (let i = 0; i < time; i++) {
            encryptText = this.decryptBase64(encryptText);
        }
        const decrypt = this.decrypt(encryptText);
        return decrypt;
    }
}
exports.Encoder = Encoder;
// let eln = new Eluncoder()
// let time = Math.floor(Math.random() * 10) + 1
// console.log(time)
// let encrypted = eln.hardEncrypter({ id: 1, name: 'asd' }, time)
// console.log(encrypted)
// console.log(eln.hardDecrypt(encrypted))
//# sourceMappingURL=index.js.map