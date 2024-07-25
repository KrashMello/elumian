import { isAlpha, isAlphaSimbols, isAlphaNumericSimbols } from "./service";
import { isAlphanumeric } from "validator";
import { Record } from "@prisma/client/runtime/library";
import isEmail from "validator/lib/isEmail";

const errorsTypes = {
  min: {
    validate: (value: string, length: number) => {
      return value && value.length >= length ? true : false;
    },
    message: "Min characters length must be ",
  },
  max: {
    validate: (value: string, length: number) => {
      return value && value.length <= length ? true : false;
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
      return !!value;
    },
    message: `The <field> must be required`,
  },
};

const validateField = (
  field: string,
  key: string,
  data: Record<string, string>,
  message: Record<string, string>,
) => {
  return field
    .split("|")
    .map((v: string) => {
      if (v.includes("min") || v.includes("max")) {
        const [type, limit] = v.split(":");
        return errorsTypes[type].validate(data[key], limit)
          ? null
          : message?.[v] ?? errorsTypes[type].message + limit;
      }
      if (!errorsTypes[v])
        return message?.["invalidField"] ?? "Field not valid";

      if (v === "required")
        errorsTypes[v].message = errorsTypes[v].message.replace("<field>", key);

      return errorsTypes[v].validate(data[key])
        ? null
        : message?.[v] ?? errorsTypes[v].message;
    })
    .filter((z: null | string) => z);
};

const compareData = (
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
  let errors: Record<string, string>;
  if (sd.filter((x) => !so.includes(x)).length > 0) {
    const m = message?.["invalidField"] ?? "Field not valid";
    errors = {
      ...errors,
      ...Object.fromEntries(
        sd
          .filter((x) => !so.includes(x))
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
            errorsValidate = validateField(
              optionsToValidate[key],
              key,
              data,
              message,
            );
          return errorsValidate.length > 0 ? [key, errorsValidate[0]] : null;
        })
        .filter((k) => k),
    ),
  };
  return Object.keys(errors).length > 0 ? errors : true;
};

module.exports = {
  compareData,
};
