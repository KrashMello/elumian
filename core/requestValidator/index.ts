import validator from "validator";
import {
  Message,
  IsLengthOptions,
  IsAlphaOptions,
  Locale,
  ResponseValidate,
} from "./types";

export class RequestValidator {
  private locale: Locale = "en-US";
  private rules: object;
  private message: Message;

  constructor(locale: Locale, rules: object, message: object) {
    this.locale = locale;
    this.rules = rules;
    this.message = message;
  }

  public getResult(query: object) {
    let rulesKeys = Object.keys(this.rules);
    let queryKeys = Object.keys(query);
    let rulesValues = Object.values(this.rules);
    let queryValues = Object.values(query);
    let temKey: string[] = [];
    let temValues: string[] = [];
    let result = rulesKeys.map((value, key) => {
      if (value === queryKeys[key]) {
        temKey = Object.keys(rulesValues[key]);
        temValues = Object.values(rulesValues[key]);
        return this.findValidator(temKey, temValues, queryValues[key]);
      }
      return { status: 1, message: "parametro enviado no es valido" };
    });

    let response = queryKeys
      .map((v, i) => {
        return [v, result[i]];
      })
      .filter((v) => {
        let r: object[] = v[1] as object[];
        if (r.length > 0) return v;
        return null;
      });
    return Object.fromEntries(response);

    // let index = result.findIndex((value) => {
    //   return (value.status = 1);
    // });
    // if (index > -1)
    //   return result.find((value) => {
    //     return (value.status = 1);
    //   });
    // else return { status: 0 };
  }
  private findValidator(
    type: string[],
    rules: string[],
    str: string | boolean | []
  ) {
    let result = [];
    result = type.map((value, key) => {
      let response: ResponseValidate;
      if (typeof value === "string")
        switch (value) {
          case "alpha":
            response = {
              status: validator.isAlpha(
                str as string,
                this.locale,
                rules[key] as IsAlphaOptions
              )
                ? 0
                : 1,
              message: validator.isAlpha(
                str as string,
                this.locale,
                rules[key] as IsAlphaOptions
              )
                ? "success"
                : this.message.alpha || "el campo solo debe contener letras",
            };
            break;
          case "length":
            const { max, min }: IsLengthOptions = rules[key] as IsLengthOptions;
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
                ? "success"
                : this.message.length ||
                  `el campo debe tener al menos ${min} y maximo ${max} caracteres`,
            };
            break;

          case "alphanumeric":
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
                ? "success"
                : this.message.alphanumeric ||
                  "el campo solo debe contener letras y numeros",
            };
            break;
          case "notNull":
            if (typeof str === "boolean")
              response = {
                status: !str ? 0 : 1,
                message: str
                  ? "success"
                  : this.message.notNull || "el campo es obligatorio",
              };
            response = {
              status: !str ? 0 : 1,
              message: str
                ? "success"
                : this.message.notNull || "el campo es obligatorio",
            };
            break;
          default:
            response = { status: 1, message: "no existe" };
            console.log("no exists");
            break;
        }
      else {
        response = { status: 1, message: "error the typeof no is sting" };
        console.log("error the typeof no is sting");
      }
      return response;
    });
    return result.filter((v) => v.status === 1);
  }
}
