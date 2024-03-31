import validator from "validator";
import {
  type Locale,
  type dataCompareValueRequest,
  type Message,
  type returnCompareValue,
} from "../type";

import { isAlpha, isAlphaSimbols, isAlphaNumericSimbols } from "./service";
import { type Response, type Request, type NextFunction } from "express";
export class RequestValidator {
  public readonly lang: Locale = "es-ES";
  public readonly optionsToValidate: Record<string, string>;
  public readonly message: Message;

  constructor(options: Record<string, string>, message?: Message) {
    this.optionsToValidate = options;
    this.message = message;
  }
  public validate(get: boolean = false): any {
    return (req: Request, res: Response, next: NextFunction) => {
      let validate: returnCompareValue;
      if (get)
        validate = this.compareValue(
          req.query,
          this.optionsToValidate,
          this.message
        );
      else {
        validate = this.compareValue(
          req.body,
          this.optionsToValidate,
          this.message
        );
      }
      if (validate !== true) {
        res.status(401).json({ type: "danger", message: validate });
        return;
      }
      next();
    };
  }

  private compareValue(
    data: dataCompareValueRequest,
    optionsToValidate: Record<string, string>,
    message: Message = {}
  ): returnCompareValue {
    const dataKey = Object.keys(data);
    const requestKey = Object.keys(optionsToValidate);
    let uncoinsident = false;
    dataKey.forEach((key) => {
      if (!requestKey.includes(key)) {
        uncoinsident = true;
        return false;
      }
      return true;
    });

    if (uncoinsident)
      return `campos unicamente necesarios: ${requestKey.toString()}`;

    let errors: Record<string, string[]> = {};

    requestKey.forEach((key): any => {
      const optionsByKey = optionsToValidate[key];
      if (optionsByKey == null) return;

      const options = optionsByKey.split("|");

      const optionsResult: string[] = [];

      options.forEach((option) => {
        let result: string | null = null;
        let MinMaxLength: number = 0;
        if (option.includes("max") || option.includes("min")) {
          const auxOption = option.split(":");
          MinMaxLength = Number(auxOption[1]);
        }
        switch (option) {
          case "alpha":
            if (
              typeof data[key] === "string" &&
              isAlpha(data[key], this.lang) === false &&
              data[key] != null
            ) {
              result = message.alpha ?? "el campo solo debe tener letras!";
            }
            break;
          case "alphaSimbols":
            if (
              typeof data[key] === "string" &&
              isAlphaSimbols(data[key], this.lang) === false &&
              data[key] != null
            ) {
              result =
                message.alphaSimbols ??
                "el campo solo debe contener letras y /_";
            }
            break;
          case "alphaNumeric":
            if (
              typeof data[key] === "string" &&
              !validator.isAlphanumeric(data[key]) &&
              data[key] != null
            ) {
              result =
                message.alphaNumeric ??
                "el campo solo debe tener letras y numeros";
            }
            break;
          case "alphaNumericSimbols":
            if (
              typeof data[key] !== "string" &&
              !isAlphaNumericSimbols(data[key]) &&
              data[key] != null
            ) {
              result =
                message.alphaNumericSimbols ??
                "el campo debe contener solo letras, numeros y -._#,/";
            }
            break;
          case "required":
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (!data[key]) {
              result = message.required ?? "el campo es requerido";
            }
            break;
          case "max":
            if (
              typeof data[key] === "string" &&
              (data[key]?.length as number) > MinMaxLength
            ) {
              result =
                message.max ??
                `el campo no debe tener mas de ${MinMaxLength} caracteres`;
            }
            break;
          case "min":
            if (
              typeof data[key] === "string" &&
              (data[key]?.length as number) < MinMaxLength
            ) {
              result =
                message.min ??
                `el campo no debe tener menos de ${MinMaxLength} caracteres`;
            }
            break;
          case "email":
            if (
              typeof data[key] === "string" &&
              !validator.isEmail(data[key] as string)
            ) {
              result =
                message.email ??
                "el campo debe ser un correo electronico ejemplo: example@myweb.com";
            }
            break;
          case "boolean":
            if (typeof data[key] !== "boolean") {
              result = message.boolean ?? "el campo debe ser booleano";
            }
            break;
          case "array":
            if (!Array.isArray(data[key])) {
              result = message.array ?? "el campo debe ser un arreglo";
            }
            break;
        }
        if (result != null) optionsResult.push(result);
      });
      if (optionsResult.length > 0)
        errors = { ...errors, [key]: optionsResult };
    });
    return Object.values(errors).length === 0 ? true : errors;
  }
}
