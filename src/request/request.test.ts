import { describe, expect, it } from "vitest";
import { isAlpha, isAlphaSimbols, isAlphaNumericSimbols } from "./service";
import { isAlphanumeric } from "validator";
import { Record } from "@prisma/client/runtime/library";
import isEmail from "validator/lib/isEmail";

class Request {
  constructor() {}
}
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

const compareValue = (
  data: Record<string, string>,
  optionsToValidate: Record<string, string>,
  message: Record<string, string> = {},
): true | Record<string, string> => {
  if (typeof data !== "object" || data === null)
    throw new Error("parameter data must be a object");
  if (typeof optionsToValidate !== "object" || optionsToValidate === null)
    throw new Error("parameter optionsToValidate must be a object");
  //if (typeof message !== "object" || message === null)
  //  throw new Error("parameter message must be a object");

  const optionsEntries = Object.entries(optionsToValidate);
  const errors: any = optionsEntries
    .map(([key]: any) => {
      let errorsValidate: string[] | string = [];
      if (optionsToValidate[key])
        errorsValidate = optionsToValidate[key]
          ?.split("|")
          .map((v: any) => {
            if (!errorsTypes[key])
              return message["invalidField"] ?? "Field not valid";
            if (v.includes("min") || v.includes("max")) {
              v = v.split(":");
              return errorsTypes[v[0]].validate(data[key], v[1])
                ? true
                : errorsTypes[v[0]].message + v[1];
            }
            if (errorsTypes[v])
              return errorsTypes[v].validate(data[key])
                ? true
                : v === "required"
                  ? errorsTypes[v].message.replace("<field>", key)
                  : errorsTypes[v].message;
            else return message["invalidField"] ?? "Field not valid";
          })
          .filter((z: boolean | string) => z !== true);
      else errorsValidate = [message["invalidField"] ?? "Field not valid"];
      return errorsValidate.length > 0 ? [key, errorsValidate[0]] : true;
    })
    .filter((k) => k !== true);
  return errors.length > 0 ? Object.fromEntries(errors) : true;
};

const request = new Request();

describe("request", () => {
  it("request are instance of Request", () => {
    expect(request).toBeInstanceOf(Request);
  });
  it("compareValue is type of function", () => {
    expect(typeof compareValue).toBe("function");
  });
  it("should throw if the data is null", () => {
    expect(() => compareValue(null)).toThrow("parameter data must be a object");
  });
  it("should throw if the optionsToValidate is null", () => {
    expect(() => compareValue({ a: "" }, null)).toThrow(
      "parameter optionsToValidate must be a object",
    );
  });
  it("should return true if data.name  lenght > 5", () => {
    expect(compareValue({ name: "hola!" }, { name: "min:5" })).toBe(true);
  });
  it("should return error if data.name lenght < 5", () => {
    expect(compareValue({ name: "hola" }, { name: "min:5" })).toStrictEqual({
      name: "Min characters length must be 5",
    });
  });
  it("should return error if data.name lenght > 5 and lenght < 10", () => {
    expect(
      compareValue(
        { name: "holaaaaaaaaaaaaaaaaaaaaa" },
        { name: "min:5|max:10" },
      ),
    ).toStrictEqual({
      name: "Max characters length must be 10",
    });
  });
  it("should return true if data.name lenght > 5 and lenght < 10", () => {
    expect(compareValue({ name: "holaaaaaa" }, { name: "min:5|max:10" })).toBe(
      true,
    );
  });
  it("should return error if data.name is not Alpha", () => {
    expect(compareValue({ name: "holaaa!$" }, { name: "alpha" })).toStrictEqual(
      {
        name: "Characters must be a-zA-Z",
      },
    );
  });
  it("should return true if data.name is Alpha", () => {
    expect(
      compareValue({ name: "holaaa" }, { name: "alpha|min:5|max:10" }),
    ).toBe(true);
  });
  it("should return true if data.name and data.password is Alpha", () => {
    expect(
      compareValue(
        { name: "holaaa", password: "a" },
        { name: "alpha|min:5|max:10", password: "alpha" },
      ),
    ).toBe(true);
  });
  it("should return error if data.name and data.password is not Alpha", () => {
    expect(
      compareValue(
        { name: "hola!$", password: "a!$" },
        { name: "alpha", password: "alpha" },
      ),
    ).toStrictEqual({
      name: "Characters must be a-zA-Z",
      password: "Characters must be a-zA-Z",
    });
  });
  it("should return error if data.name isAlphaSimbols", () => {
    expect(
      compareValue({ name: "123" }, { name: "alphaSimbol" }),
    ).toStrictEqual({
      name: "Characters must be a-zA-Z -.&,_#!*/",
    });
  });
  it("should return true if data.name isAlphaNumeric", () => {
    expect(
      compareValue({ name: "123-." }, { name: "alphaNumericSimbols" }),
    ).toBe(true);
  });
  it("should return errors field password if not exists field in optionsToValidate", () => {
    expect(compareValue({ password: "-." }, { name: "min:5" })).toStrictEqual({
      password: "Field not valid",
    });
  });
  it("should return errors field email if not exists field in optionsTypes", () => {
    expect(compareValue({ email: "-." }, { email: "emails" })).toStrictEqual({
      email: "Field not valid",
    });
  });
  it("should return errors field email", () => {
    expect(compareValue({ email: "-." }, { email: "email" })).toStrictEqual({
      email: "Please enter a valid email address example: foo@gmail.com",
    });
  });
  it("should return errors field password change message", () => {
    expect(
      compareValue(
        { email: "-.", password: "algo" },
        { email: "alphaSimbol" },
        { invalidField: "campo no valido" },
      ),
    ).toStrictEqual({
      password: "campo no valido",
    });
  });
  it("should return errors field must be boolean", () => {
    expect(compareValue({ check: "true" }, { check: "boolean" })).toStrictEqual(
      {
        check: "Please enter a boolean",
      },
    );
  });
  it("should return errors field must be required", () => {
    expect(
      compareValue({ check: true }, { check: "boolean", password: "required" }),
    ).toStrictEqual({
      password: "The password must be required",
    });
  });
});
