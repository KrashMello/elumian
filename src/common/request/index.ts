import {
  isAlpha,
  isAlphaSimbols,
  isDate,
  isAlphaNumericSimbols,
} from "./validations";
import { isAlphanumeric, isNumeric } from "validator";
import { Record } from "@prisma/client/runtime/library";
import isEmail from "validator/lib/isEmail";
import isBoolean from "validator/lib/isBoolean";
import { validationsMessage, validationsOptions, validationsOptionsFields } from "./type";
export let messages = {
  min: "Min characters length must be ",
  max: "Max characters length must be ",
  alpha: "Characters must be a-zA-Z",
  alphaSimbol: "Characters must be a-zA-Z -.&,_#!*/",
  alphaNumeric: "Characters must be a-zA-Z1-9",
  numeric: "Please enter a valid number (e.g., 1234)",
  alphaNumericSimbols: "Characters must be a-zA-Z1-9  -.&,_#*/",
  email: "Please enter a valid email address (e.g., foo@gmail.com)",
  boolean: "Please enter a boolean",
  date: "Please enter a valid date (e.g., 2020-01-01)",
  required: `The <field> must be required`,
  invalidField: "field is not valid",
}
export const setMessages = (newMessages: validationsMessage) => {
  messages = { ...messages, ...newMessages };
}

export class validations {
  static dataCompare = {
    min: (value: string, length: number) =>
      value && value.length >= length,
    max: (value: string, length: number) =>
      value && value.length <= length,
    alpha: (value: string) => (value ? isAlpha(value, "es-ES") : true),
    alphaSimbol: (value: string) =>
      value ? isAlphaSimbols(value ?? "", "es-ES") : true,
    alphaNumeric: (value: string) =>
      value ? isAlphanumeric(value, "es-ES", { ignore: " " }) : true,
    numeric: (value: string) => (value ? isNumeric(value) : true),
    alphaNumericSimbols: (value: string) =>
      value ? isAlphaNumericSimbols(value, "es-ES") : true,
    email: (value: string) => (value ? isEmail(value) : true),
    boolean: (value: any) => (value ? isBoolean(value) : true),
    date: (value: string) => (value ? isDate(value, "YYYY-MM-DD") : true),
    required: (value: string) => !!value,
  }
  static validateField(
    optionsToValidate: validationsOptionsFields[],
    key: string,
    data: Record<string, string>,
  ): string[] {
    return optionsToValidate
      .map((v: validationsOptionsFields) => {
        if (v.includes("min") || v.includes("max")) {
          const [type, limit]: ["min" | "max", number] = v.split(":") as [
            "min" | "max",
            number,
          ];
          return this.dataCompare[type](data[key], Number(limit))
            ? null
            : (messages[v] + Number(limit));
        }
        if (!this.dataCompare[v]) {
          return messages.invalidField;
        }

        if (v === "required")
          messages[v] = messages[v].replace("<field>", key);

        return this.dataCompare[v](data[key])
          ? null
          : (messages[v]);
      })
      .filter((z: null | string) => z);
  };
  static compareData(
    data: Record<string, any>,
    optionsToValidate: validationsOptions,
  ): true | Record<string, string> {
    if (typeof data !== "object" || data === null)
      throw new Error("parameter data must be an object");
    if (typeof optionsToValidate !== "object" || optionsToValidate === null)
      throw new Error("parameter optionsToValidate must be an object");

    const keysData = Object.keys(data);
    const keysOptionsV = Object.keys(optionsToValidate);
    let errors: Record<string, string>;
    if (keysData.filter((x) => !keysOptionsV.includes(x)).length > 0) {
      const m = messages.invalidField;
      errors = {
        ...errors,
        ...Object.fromEntries(
          keysData
            .filter((x) => !keysOptionsV.includes(x))
            .map((key) => {
              return [key, m];
            }),
        ),
      };
    }
    const optionsEntries = Object.entries(optionsToValidate);
    errors = {
      ...errors,
      ...Object.fromEntries(
        optionsEntries
          .map(([key]: any) => {
            let errorsValidate: (string | false)[] | string = [];
            if (optionsToValidate[key])
              errorsValidate = this.validateField(
                optionsToValidate[key],
                key,
                data,
              );
            return errorsValidate.length > 0 ? [key, errorsValidate[0]] : null;
          })
          .filter((k) => k),
      ),
    };
    return Object.keys(errors).length > 0 ? errors : true;
  };
}

