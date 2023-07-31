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
} from './type'

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
      } else return [{ status: 1, message: 'Invalid param' }]
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
                  : this.message.alpha || 'The param only need letter',
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
                    'The param only need letter and this special simbol -',
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
                    `the param need a length of ${min} to ${max} character`,
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
                    'the param only need [A-Za-Z0-9]',
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
                    'The param only need [A-Za-Z0-9] and especial character -',
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
                  : this.message.notNull || 'this param is necesary',
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
                : this.message.numeric || 'The param just can be numeric',
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
                  'the params need be a email example: ejemplo@example.com',
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
                : this.message.boolean || 'the param just can be true/false',
            }
            break
          case 'isArray':
            response = {
              status: Array.isArray(str as string[]) ? 0 : 1,
              message: Array.isArray(str as string[])
                ? 'success'
                : this.message.isArray || 'the param just need be a array',
            }
            break
          default:
            response = { status: 1, message: 'Dont Exist' }
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
