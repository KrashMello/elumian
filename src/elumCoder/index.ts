import * as crypto from 'crypto'

export class Eluncoder {
  // Define la clave secreta
  private readonly secretKey: string = process.env.eln_SECRET_KEY
    ? process.env.eln_SECRET_KEY
    : 'secretKey'

  // Define el tipo de algoritmo
  private readonly algorithm: string = 'aes-256-cbc'
  // Convierte la clave secreta a un buffer
  private readonly secretKeyBuffer: Buffer = Buffer.alloc(32, this.secretKey, 'utf8')
  // Crea un vector de inicialización aleatorio
  private readonly iv: Buffer = crypto.randomBytes(16)

  public encrypted (data: object): string {
    // Convierte el objeto a una cadena JSON
    const plainText: string = JSON.stringify(data)
    const cipher: crypto.Cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKeyBuffer,
      this.iv
    )
    let cipherText: string = cipher.update(plainText, 'utf8', 'hex')
    cipherText += cipher.final('hex')

    return cipherText
  }

  public encryptedBase64 (text: string): string {
    const cipher: crypto.Cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKeyBuffer,
      this.iv
    )
    let encrypted = cipher.update(text)

    encrypted = Buffer.concat([encrypted, cipher.final()])
    return encrypted.toString('base64')
  }

  public decrypt (data: string) {
    // Descifra los datos con la clave secreta y los parámetros del algoritmo

    const decipher: crypto.Decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKeyBuffer,
      this.iv
    )
    let decryptedText: string = decipher.update(data, 'hex', 'utf8')
    decryptedText += decipher.final('utf8')
    const decryptedObject: object = JSON.parse(decryptedText)
    return decryptedObject
  }

  public decryptBase64 (text: string) {
    // Descifra los datos con la clave secreta y los parámetros del algoritmo
    const encryptedText = Buffer.from(text, 'base64')
    const decipher: crypto.Decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKeyBuffer,
      this.iv
    )
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  }

  hardEncrypter (data: object, time: number): string {
    let encryptText = this.encrypted(data)
    for (let i = 0; i < time; i++) {
      encryptText = this.encryptedBase64(encryptText)
    }
    return `${time}.${encryptText}`
  }

  hardDecrypt (data: string) {
    let [Stime, encryptText] = data.split('.')
    encryptText = encryptText ?? ''
    const time: number = Number(Stime) ?? 1
    let decrypt: any
    for (let i = 0; i < time; i++) {
      encryptText = this.decryptBase64(encryptText)
    }
    decrypt = this.decrypt(encryptText)

    return decrypt
  }
}
// let eln = new Eluncoder()
// let time = Math.floor(Math.random() * 10) + 1
// console.log(time)
// let encrypted = eln.hardEncrypter({ id: 1, name: 'asd' }, time)
// console.log(encrypted)
// console.log(eln.hardDecrypt(encrypted))
