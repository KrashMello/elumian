import { isAlpha, isAlphaSimbols, isAlphaNumericSimbols } from "./service";
import { isAlphanumeric } from "validator";
import { Record } from "@prisma/client/runtime/library";
import isEmail from "validator/lib/isEmail";

const errorsTypes = {
  min: {
    validate: (value: string, length: number) => {
      return value.length >= length ? true : false;
    },
    message: "Min characters length must be ",
  },
  max: {
    validate: (value: string, length: number) => {
      return value.length <= length ? true : false;
    },
    message: "Max characters length must be ",
  },
  alpha: {
    validate: (value: string): boolean => {
      return isAlpha(value, "es-ES");
    },
    message: "Characters must be a-zA-Z",
  },
  alphaSimbol: {
    validate: (value: string): boolean => {
      return isAlphaSimbols(value, "es-ES");
    },
    message: "Characters must be a-zA-Z -.&,_#!*/",
  },
  alphaNumeric: {
    validate: (value: string): boolean => {
      return isAlphanumeric(value);
    },
    message: "Characters must be a-zA-Z1-9",
  },
  alphaNumericSimbols: {
    validate: (value: string): boolean => {
      return isAlphaNumericSimbols(value);
    },
    message: "Characters must be a-zA-Z1-9  -.&,_#*/",
  },
  email: {
    validate: (value: string): boolean => {
      return isEmail(value);
    },
    message: "Please enter a valid email address example: foo@gmail.com",
  },
  boolean: {
    validate: (value: string): boolean => {
      return typeof value === "boolean" ? true : false;
    },
    message: "Please enter a boolean",
  },
  required: {
    validate: (value: string): boolean => {
      return !value ? false : true;
    },
    message: `The <field> must be required`,
  },
};

type errors = keyof typeof errorsTypes;

export const compareValue = (
  data: Record<string, string>,
  optionsToValidate: Record<string, string>,
  message?: Record<string, string>,
): true | Record<string, string> => {
  if (typeof data !== "object" || data === null)
    throw new Error("parameter data must be a object");
  if (typeof optionsToValidate !== "object" || optionsToValidate === null)
    throw new Error("parameter optionsToValidate must be a object");

  const sd = Object.keys(data);
  const so = Object.keys(optionsToValidate);
  if (sd.filter((x) => !so.includes(x))) {
    console.log(
      JSON.parse(
        '{"' +
          sd.filter((x) => !so.includes(x))[0] +
          '": "' +
          "campo no valido" +
          '"}',
      ),
    );
    return JSON.parse(
      `{"${sd.filter((x) => !so.includes(x))[0]}": "${message["invalidField"] ?? "Field not valid"}"}`,
    );
  }
  const optionsEntries = Object.entries(optionsToValidate);
  const errors: any = optionsEntries
    .map(([key]: any) => {
      let errorsValidate: (string | false)[] | string = [];

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
