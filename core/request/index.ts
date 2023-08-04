import _ from 'lodash'
import validator from 'validator'
import {
  Locale,
  Message,
  dataCompareValueRequest,
  returnCompareValue,
} from './type'
import { isAlpha, isAlphaSimbols, isAlphanumericSimbols } from './service'

// let optionsToValidate = {
//   username: 'required|max:15|min:8|alpha|array',
//   password: 'required|max:50|min:8|alphaNumeric',
// }

export class Request {
  private lang: Locale = 'es-ES'
  private optionsToValidate: { [key: string]: string }
  private message: Message
  constructor(
    optionsToValidate: { [key: string]: string },
    message: Message = {}
  ) {
    this.optionsToValidate = optionsToValidate
    this.message = message
  }

  public validate(data: dataCompareValueRequest): returnCompareValue {
    return this.compareValue(data, this.optionsToValidate, this.message)
  }

  private compareValue(
    data: dataCompareValueRequest,
    optionsToValidate: { [key: string]: string },
    message: Message = {}
  ): returnCompareValue {
    let dataKey = Object.keys(data)
    let requestKey = Object.keys(optionsToValidate)
    if (!_.isEqual(dataKey, requestKey))
      return `campos unicamente necesarios: ${requestKey.toString()}`

    let errors: { [key: string]: Array<string> } = {}

    requestKey.map((key) => {
      let options = optionsToValidate[key]?.split('|') as string[]
      let optionsResult: Array<string> = []

      optionsResult = options
        .map((option) => {
          let result: string | null = null
          let min_max_length: number = 0
          if (option.includes('max') || option.includes('min')) {
            let auxOption = option.split(':')
            option = auxOption[0] as string
            min_max_length = Number(auxOption[1])
          }
          switch (option) {
            case 'alpha':
              if (
                typeof data[key] === 'string' &&
                !isAlpha(data[key] as string, this.lang)
              )
                result = message.alpha || 'el campo solo debe tener letras!'
              break
            case 'alphaSimbols':
              if (
                typeof data[key] === 'string' &&
                !isAlphaSimbols(data[key] as string, this.lang)
              )
                result =
                  message.alphaSimbols ||
                  'el campo solo debe contener letras y /_'
              break
            case 'alphaNumeric':
              if (
                typeof data[key] === 'string' &&
                !validator.isAlphanumeric(data[key] as string)
              )
                result =
                  message.alphaNumeric ||
                  `el campo solo debe tener letras y numeros`
              break
            case 'alphaNumericSimbols':
              if (
                (typeof data[key] === 'string' && !data[key]) ||
                !isAlphanumericSimbols(data[key] as string)
              )
                result =
                  message.alphaNumericSimbols ||
                  'el campo debe contener solo letras, numeros y /_'
              break
            case 'required':
              if (!data[key])
                result = message.required || 'el campo es requerido'
              break
            case 'max':
              if (
                typeof data[key] === 'string' &&
                (!data[key] || (data[key]?.length as number) > min_max_length)
              )
                result =
                  message.max ||
                  `el campo no debe tener mas de ${min_max_length} caracteres`
              break
            case 'min':
              if (
                typeof data[key] === 'string' &&
                (!data[key] || (data[key]?.length as number) < min_max_length)
              )
                result =
                  message.min ||
                  `el campo no debe tener menos de ${min_max_length} caracteres`
              break
            case 'email':
              if (
                typeof data[key] === 'string' &&
                (!data[key] || !validator.isEmail(data[key] as string))
              )
                result =
                  message.email ||
                  'el campo debe ser un correo electronico ejemplo: example@myweb.com'
              break
            case 'boolean':
              if (typeof data[key] !== 'boolean')
                result = message.boolean || 'el campo debe ser booleano'
              break
            case 'array':
              if (
                typeof data[key] !== 'string' &&
                (!data[key] || !Array.isArray(data[key]))
              )
                result = message.array || 'el campo debe ser un arreglo'
              break
            default:
              result
          }
          return result
        })
        .filter((v) => v) as Array<string>
      if (optionsResult.length > 0) errors = { ...errors, [key]: optionsResult }
    })
    return Object.values(errors).length === 0 ? true : errors
  }
}
