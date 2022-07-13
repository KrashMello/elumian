import { RequestValidator } from "#Class/validator";

const rule = {
  username: {
    alpha: {},
    length: { min: 5, max: 15 },
  },
  password: {
    alphanumeric: {},
    length: { min: 4, max: 15 },
  },
};

const message = {
  alpha: "las letras no coinciden",
  length: "debe meter mas numeros ",
  alphanumeric: "debe haber solo letras y numeros",
};

export const userRequestValidate = new RequestValidator("en-US", rule, message);
