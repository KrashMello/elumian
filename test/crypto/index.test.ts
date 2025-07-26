import eln from "elumian/core/crypto"
let time = Math.floor(Math.random() * 10) + 1
console.log(time)
let encrypted = eln.hardEncryptor({ id: 1, name: 'asd' }, time)
console.log(encrypted)
console.log(eln.hardDecrypt(encrypted))
