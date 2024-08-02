import { validationsMessage, validationsOptions } from "../../../src/type";

const loginDataOptions: validationsOptions = {
  username: ["alpha", "required"],
  password: ["alphaSimbol", "required"],
};

export const loginDataRequest = {
  options: loginDataOptions,
};
