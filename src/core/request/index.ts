import { isAlpha, isAlphaSimbols, isAlphaNumericSimbols } from "./validations";
import { isAlphanumeric } from "validator";
import { Record } from "@prisma/client/runtime/library";
import isEmail from "validator/lib/isEmail";

type BaseValidations = keyof typeof errorsTypes;
type MinMaxValidations = `min:${number}` | `max:${number}`;
type validationsOptionsFields = BaseValidations | MinMaxValidations;

export type validationsOptions = Record<
  string,
  Array<validationsOptionsFields>
>;

export type validationsMessage = Partial<
  Record<validationsOptionsFields, string>
>;

export const errorsTypes = {
  min: {
    validate: (value: string, length: number) =>
      value && value.length >= length,
    message: "Min characters length must be ",
  },
  max: {
    validate: (value: string, length: number) =>
      value && value.length <= length,
    message: "Max characters length must be ",
  },
  alpha: {
    validate: (value: string) => isAlpha(value, "es-ES"),
    message: "Characters must be a-zA-Z",
  },
  alphaSimbol: {
    validate: (value: string) => isAlphaSimbols(value, "es-ES"),
    message: "Characters must be a-zA-Z -.&,_#!*/",
  },
  alphaNumeric: {
    validate: (value: string) => isAlphanumeric(value),
    message: "Characters must be a-zA-Z1-9",
  },
  alphaNumericSimbols: {
    validate: (value: string) => isAlphaNumericSimbols(value),
    message: "Characters must be a-zA-Z1-9  -.&,_#*/",
  },
  email: {
    validate: (value: string) => isEmail(value),
    message: "Please enter a valid email address (e.g., foo@gmail.com)",
  },
  boolean: {
    validate: (value: any) => typeof value === "boolean",
    message: "Please enter a boolean",
  },
  required: {
    validate: (value: string) => !!value,
    message: `The <field> must be required`,
  },
};

const validateField = (
  optionsToValidate: validationsOptionsFields[],
  key: string,
  data: Record<string, string>,
  message: Record<string, string>,
): string[] => {
  return optionsToValidate
    .map((v: validationsOptionsFields) => {
      if (v.includes("min") || v.includes("max")) {
        const [type, limit]: ["min" | "max", number] = v.split(":") as [
          "min" | "max",
          number,
        ];
        return errorsTypes[type].validate(data[key], Number(limit))
          ? null
          : message?.[v] ?? errorsTypes[type].message + Number(limit);
      }
      if (!errorsTypes[v]) {
        return message?.["invalidField"] ?? "Field not valid";
      }

      if (v === "required")
        errorsTypes[v].message = errorsTypes[v].message.replace("<field>", key);

      return errorsTypes[v].validate(data[key])
        ? null
        : message?.[v] ?? errorsTypes[v].message;
    })
    .filter((z: null | string) => z);
};

export const compareData = (
  data: Record<string, any>,
  optionsToValidate: validationsOptions,
  message?: validationsMessage,
): true | Record<string, string> => {
  if (typeof data !== "object" || data === null)
    throw new Error("parameter data must be an object");
  if (typeof optionsToValidate !== "object" || optionsToValidate === null)
    throw new Error("parameter optionsToValidate must be an object");

  const keysData = Object.keys(data);
  const keysOptionsV = Object.keys(optionsToValidate);
  let errors: Record<string, string>;
  if (keysData.filter((x) => !keysOptionsV.includes(x)).length > 0) {
    const m = message?.["invalidField"] ?? "Field not valid";
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
