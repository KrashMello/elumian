import validator from 'validator'
import { isAlpha, isAlphanumericSimbols, isAlphaSimbols } from './service'
import {
  Message,
  IsLengthOptions,
  IsAlphaOptions,
  Locale,
  ResponseValidate,
  IsNumericOptions,
  IsEmailOptions,
  isBooleansOptions,
} from './types'

export class RequestValidator {
  private locale: Locale = 'en-US'
  private rules: object
  private message: Message

  constructor(locale: Locale, rules: object, message: object = {}) {
    this.locale = locale
    this.rules = rules
    this.message = message
  }

  public getResult(query: object) {
    let rulesKeys = Object.keys(this.rules)
    let queryKeys = Object.keys(query)
    let rulesValues = Object.values(this.rules)
    let queryValues = Object.values(query)
    let temKey: string[] = []
    let temValues: string[] = []
    let result = queryKeys.map((value, key) => {
      if (rulesKeys.filter((v) => v === value).length > 0) {
        temKey = Object.keys(
          rulesValues[rulesKeys.findIndex((v) => v === value)]
        )
        temValues = Object.values(
          rulesValues[rulesKeys.findIndex((v) => v === value)]
        )

        return this.findValidator(temKey, temValues, queryValues[key])
      } else return [{ status: 1, message: 'parametro enviado no es valido' }]
    })
    let response = queryKeys
      .map((v, i) => {
        return [v, result[i]]
      })
      .filter((v) => {
        let r: object[] = v[1] as object[]
        // console.log(r);
        if (r.length > 0) return v
        else return null
      })
    return Object.fromEntries(response)
  }
  private findValidator(
    type: string[],
    rules: string[],
    str: string | boolean | [] | number | null
  ) {
    // console.log({ type, rules, str });
    let result = []
    result = type.map((value, key) => {
      // console.log(value);
      let response: ResponseValidate
      if (typeof value === 'string')
        switch (value) {
          case 'alpha':
            if (str)
              response = {
                status: isAlpha(
                  str as string,
                  this.locale,
                  rules[key] as IsAlphaOptions
                )
                  ? 0
                  : 1,
                message: isAlpha(
                  str as string,
                  this.locale,
                  rules[key] as IsAlphaOptions
                )
                  ? 'success'
                  : this.message.alpha || 'el campo solo debe contener letras',
              }
            else response = { status: 0, message: 'success' }
            break
          case 'alphaSimbols':
            if (str)
              response = {
                status: isAlphaSimbols(
                  str as string,
                  this.locale,
                  rules[key] as IsAlphaOptions
                )
                  ? 0
                  : 1,
                message: isAlphaSimbols(
                  str as string,
                  this.locale,
                  rules[key] as IsAlphaOptions
                )
                  ? 'success'
                  : this.message.alpha ||
                    'el campo solo debe contener letras y -',
              }
            else response = { status: 0, message: 'success' }

            break

          case 'length':
            if (str) {
              const { max, min }: IsLengthOptions = rules[
                key
              ] as IsLengthOptions
              response = {
                status: validator.isLength(
                  str as string,
                  rules[key] as IsLengthOptions
                )
                  ? 0
                  : 1,
                message: validator.isLength(
                  str as string,
                  rules[key] as IsLengthOptions
                )
                  ? 'success'
                  : this.message.length ||
                    `el campo debe tener al menos ${min} y maximo ${max} caracteres`,
              }
            } else response = { status: 0, message: 'success' }
            break

          case 'alphanumeric':
            if (str)
              response = {
                status: validator.isAlphanumeric(
                  str as string,
                  this.locale,
                  rules[key] as IsAlphaOptions
                )
                  ? 0
                  : 1,
                message: validator.isAlphanumeric(
                  str as string,
                  this.locale,
                  rules[key] as IsAlphaOptions
                )
                  ? 'success'
                  : this.message.alphanumeric ||
                    'el campo solo debe contener letras y numeros',
              }
            else response = { status: 0, message: 'success' }
            break
          case 'alphanumericSimbols':
            if (str)
              response = {
                status: isAlphanumericSimbols(
                  str as string,
                  this.locale,
                  rules[key] as IsAlphaOptions
                )
                  ? 0
                  : 1,
                message: isAlphanumericSimbols(
                  str as string,
                  this.locale,
                  rules[key] as IsAlphaOptions
                )
                  ? 'success'
                  : this.message.alphanumeric ||
                    'el campo solo debe contener letras y numeros',
              }
            else response = { status: 0, message: 'success' }
            break

          case 'notNull':
            if (typeof str === 'boolean')
              response = {
                status: 0,
                message: 'success',
              }
            else
              response = {
                status: !str ? 1 : 0,
                message: str
                  ? 'notNull'
                  : this.message.notNull || 'el campo es obligatorio',
              }
            break
          case 'numeric':
            str = String(str)
            response = {
              status: validator.isNumeric(
                str as string,
                rules[key] as IsNumericOptions
              )
                ? 0
                : 1,
              message: validator.isNumeric(
                str as string,
                rules[key] as IsNumericOptions
              )
                ? 'success'
                : this.message.numeric || 'el campo debe contener solo numeros',
            }
            break
          case 'email':
            response = {
              status: validator.isEmail(
                str as string,
                rules[key] as IsEmailOptions
              )
                ? 0
                : 1,
              message: validator.isEmail(
                str as string,
                rules[key] as IsEmailOptions
              )
                ? 'success'
                : this.message.email ||
                  'el campo debe contener un correo electronico ejemplo@prueba.com',
            }
            break
          case 'boolean':
            response = {
              status: validator.isBoolean(
                str?.toString() as string,
                rules[key] as isBooleansOptions
              )
                ? 0
                : 1,
              message: validator.isBoolean(
                str?.toString() as string,
                rules[key] as isBooleansOptions
              )
                ? 'success'
                : this.message.boolean || 'el campo debe ser un valor booleano',
            }
            break
          case 'isArray':
            response = {
              status: Array.isArray(str as string[]) ? 0 : 1,
              message: Array.isArray(str as string[])
                ? 'success'
                : this.message.isArray || 'el campo debe ser un arreglo',
            }
            break
          default:
            response = { status: 1, message: 'no existe' }
            break
        }
      else {
        response = { status: 1, message: 'error the typeof no is sting' }
        console.log('error the typeof no is sting')
      }
      // console.log(response);
      return response
    })
    return result.filter((v) => v.status === 1)
  }
}
