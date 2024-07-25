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
        validate = this.compareData(
          req.query,
          this.optionsToValidate,
          this.message,
        );
      else {
        validate = this.compareData(
          req.body,
          this.optionsToValidate,
          this.message,
        );
      }
      if (validate !== true) {
        res.status(401).json({ type: "danger", message: validate });
        return;
      }
      next();
    };
  }
  private validations = {
    alpha: (value: string, message?: string): string => {
      if (
        typeof value === "string" &&
        isAlpha(value, this.lang) === false &&
        value != null
      )
        return message ?? "el campo solo debe tener letras!";
    },
    alphaSimbols: (value: string, message?: string): string => {
      if (
        typeof value === "string" &&
        isAlphaSimbols(value, this.lang) === false
      )
        return message ?? "el campo solo debe contener letras y /_";
    },
    alphaNumeric: (value: string, message?: string): string => {
      if (typeof value === "string" && !validator.isAlphanumeric(value))
        return message ?? "el campo solo debe tener letras y numeros";
    },
    alphaNumericSimbols: (value: string, message?: string): string => {
      if (
        typeof value !== "string" &&
        !isAlphaNumericSimbols(value) &&
        value != null
      )
        return (
          message ?? "el campo debe contener solo letras, numeros y -._#,/"
        );
    },
    required: (value: any, message?: string): string => {
      if (!value) return message ?? "el campo es requerido";
    },
    max: (value: string, MinMaxLength: number, message?: string): string => {
      if (typeof value === "string" && (value?.length as number) > MinMaxLength)
        return (
          message ?? `el campo no debe tener mas de ${MinMaxLength} caracteres`
        );
    },
    min: (value: string, MinMaxLength: number, message?: string): string => {
      if (typeof value === "string" && (value?.length as number) < MinMaxLength)
        return (
          message ??
          `el campo no debe tener menos de ${MinMaxLength} caracteres`
        );
    },
    email: (value: string, message?: string): string => {
      if (typeof value === "string" && !validator.isEmail(value as string))
        return (
          message ??
          "el campo debe ser un correo electronico ejemplo: example@myweb.com"
        );
    },
    boolean: (value: any, message?: string): string => {
      if (typeof value !== "boolean")
        return message ?? "el campo debe ser booleano";
    },
    array: (value: any, message?: string): string => {
      if (!Array.isArray(value))
        return message ?? "el campo debe ser un arreglo";
    },
  };
  private compareData(
    data: dataCompareValueRequest,
    optionsToValidate: Record<string, string>,
    message: Message = {},
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

      options.forEach((option: any) => {
        let result: string | null = null;
        let MinMaxLength: number = 0;
        if (option.includes("max") || option.includes("min")) {
          const auxOption = option.split(":");
          MinMaxLength = Number(auxOption[1]);
          result = this.validations[option](
            data[key],
            MinMaxLength,
            message[option],
          );
        }
        result = this.validations[option](data[key], message[option]);
        if (result != null) optionsResult.push(result);
      });
      if (optionsResult.length > 0)
        errors = { ...errors, [key]: optionsResult };
    });
    return Object.values(errors).length === 0 ? true : errors;
  }
}
