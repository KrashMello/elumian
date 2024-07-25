import { describe, expect, it } from "vitest";
import { compareData } from "./request";
class Request {
  constructor() {}
}

const request = new Request();

describe("request", () => {
  it("request are instance of Request", () => {
    expect(request).toBeInstanceOf(Request);
  });
  it("compareData is type of function", () => {
    expect(typeof compareData).toBe("function");
  });
  it("should throw if the data is null", () => {
    expect(() => compareData(null)).toThrow("parameter data must be a object");
  });
  it("should throw if the optionsToValidate is null", () => {
    expect(() => compareData({ a: "" }, null)).toThrow(
      "parameter optionsToValidate must be a object",
    );
  });
  it("should return true if data.name  lenght > 5", () => {
    expect(compareData({ name: "hola!" }, { name: "min:5" })).toBe(true);
  });
  it("should return error if data.name lenght < 5", () => {
    expect(compareData({ name: "hola" }, { name: "min:5" })).toStrictEqual({
      name: "Min characters length must be 5",
    });
  });
  it("should return error if data.name lenght > 5 and lenght < 10", () => {
    expect(
      compareData(
        { name: "holaaaaaaaaaaaaaaaaaaaaa" },
        { name: "min:5|max:10" },
      ),
    ).toStrictEqual({
      name: "Max characters length must be 10",
    });
  });
  it("should return true if data.name lenght > 5 and lenght < 10", () => {
    expect(compareData({ name: "holaaaaaa" }, { name: "min:5|max:10" })).toBe(
      true,
    );
  });
  it("should return error if data.name is not Alpha", () => {
    expect(compareData({ name: "holaaa!$" }, { name: "alpha" })).toStrictEqual({
      name: "Characters must be a-zA-Z",
    });
  });
  it("should return true if data.name is Alpha", () => {
    expect(
      compareData({ name: "holaaa" }, { name: "alpha|min:5|max:10" }),
    ).toBe(true);
  });
  it("should return true if data.name and data.password is Alpha", () => {
    expect(
      compareData(
        { name: "holaaa", password: "a" },
        { name: "alpha|min:5|max:10", password: "alpha" },
      ),
    ).toBe(true);
  });
  it("should return error if data.name and data.password is not Alpha", () => {
    expect(
      compareData(
        { name: "hola!$", password: "a!$" },
        { name: "alpha", password: "alpha" },
      ),
    ).toStrictEqual({
      name: "Characters must be a-zA-Z",
      password: "Characters must be a-zA-Z",
    });
  });
  it("should return error if data.name isAlphaSimbols", () => {
    expect(compareData({ name: "123" }, { name: "alphaSimbol" })).toStrictEqual(
      {
        name: "Characters must be a-zA-Z -.&,_#!*/",
      },
    );
  });
  it("should return true if data.name isAlphaNumeric", () => {
    expect(
      compareData({ name: "123-." }, { name: "alphaNumericSimbols" }),
    ).toBe(true);
  });
  it("should return errors field password if not exists field in optionsToValidate", () => {
    expect(compareData({ password: "-." }, { name: "min:5" })).toStrictEqual({
      password: "Field not valid",
    });
  });
  it("should return errors field email if not exists field in optionsTypes", () => {
    expect(compareData({ email: "-." }, { email: "emails" })).toStrictEqual({
      email: "Field not valid",
    });
  });
  it("should return errors field email", () => {
    expect(compareData({ email: "-." }, { email: "email" })).toStrictEqual({
      email: "Please enter a valid email address example: foo@gmail.com",
    });
  });
  it("should return errors field password change message", () => {
    expect(
      compareData(
        { email: "-.", password: "algo" },
        { email: "alphaSimbol" },
        { invalidField: "campo no valido" },
      ),
    ).toStrictEqual({
      password: "campo no valido",
    });
  });
  it("should return errors field must be boolean", () => {
    expect(compareData({ check: "true" }, { check: "boolean" })).toStrictEqual({
      check: "Please enter a boolean",
    });
  });
  it("should return errors field must be required", () => {
    expect(
      compareData({ check: true }, { check: "boolean", password: "required" }),
    ).toStrictEqual({
      password: "The password must be required",
    });
  });
});
