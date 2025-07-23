
import { validations, setMessages } from "@elumian/core/request"
setMessages({ required: '<field> es requerido' })
const validate = validations.compareData({ piel: "uss", perro: "123" }, { perro: ['numeric'], piel: ['required'] })
console.log(validate)
