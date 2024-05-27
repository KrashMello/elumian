import { isAlpha, isAlphaSimbols, isAlphaNumericSimbols } from "./service";
import { isAlphanumeric } from "validator";
import { Record } from "@prisma/client/runtime/library";
import isEmail from "validator/lib/isEmail";
import { difference } from "lodash";

const errorsTypes = {
  min: {
    validate: (value, length) => {
      return value.length >= length ? true : false;
    },
    message: "Min characters length must be ",
  },
  max: {
    validate: (value, length) => {
      return value.length <= length ? true : false;
    },
    message: "Max characters length must be ",
  },
  alpha: {
    validate: (value) => {
      return isAlpha(value, "es-ES");
    },
    message: "Characters must be a-zA-Z",
  },
  alphaSimbol: {
    validate: (value) => {
      return isAlphaSimbols(value, "es-ES");
    },
    message: "Characters must be a-zA-Z -.&,_#!*/",
  },
  alphaNumeric: {
    validate: (value) => {
      return isAlphanumeric(value);
    },
    message: "Characters must be a-zA-Z1-9",
  },
  alphaNumericSimbols: {
    validate: (value) => {
      return isAlphaNumericSimbols(value);
    },
    message: "Characters must be a-zA-Z1-9  -.&,_#*/",
  },
  email: {
    validate: (value) => {
      return isEmail(value);
    },
    message: "Please enter a valid email address example: foo@gmail.com",
  },
  boolean: {
    validate: (value) => {
      return typeof value === "boolean" ? true : false;
    },
    message: "Please enter a boolean",
  },
  required: {
    validate: (value) => {
      return !value ? false : true;
    },
    message: `The <field> must be required`,
  },
};

export const compareValue = (
  data: Record<string, string>,
  optionsToValidate: Record<string, string>,
  message: Record<string, string> = {},
): true | Record<string, string> => {
  if (typeof data !== "object" || data === null)
    throw new Error("parameter data must be a object");
  if (typeof optionsToValidate !== "object" || optionsToValidate === null)
    throw new Error("parameter optionsToValidate must be a object");

  const optionsEntries = Object.entries(optionsToValidate);
  const sd = new Set(Object.keys(data));
  const so = new Set(Object.keys(optionsToValidate));
  const errors: any = optionsEntries
    .map(([key]: any) => {
      let errorsValidate: string[] | string = [];

      if (optionsToValidate[key])
        errorsValidate = optionsToValidate[key]
          ?.split("|")
          .map((v: any) => {
            const [type, limit] = v.split(":");
            if (!Object.keys(errorsTypes).find((z) => z !== type))
              return message["invalidField"] ?? "Field not valid";
            if (type === "min" || type === "max") {
              return errorsTypes[type].validate(data[key], limit)
                ? true
                : errorsTypes[type].message + limit;
            }
            return errorsTypes[v].validate(data[key])
              ? true
              : v === "required"
                ? message[v] ?? errorsTypes[v].message.replace("<field>", key)
                : message[v] ?? errorsTypes[v].message;
          })
          .filter((z: boolean | string) => z !== true);
      else errorsValidate = [message["invalidField"] ?? "Field not valid"];
      return errorsValidate.length > 0 ? [key, errorsValidate[0]] : true;
    })
    .filter((k) => k !== true);
  return errors.length > 0 ? Object.fromEntries(errors) : true;
};
