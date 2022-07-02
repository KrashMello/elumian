import { RequestValidator } from "#Class/validator";

const userRule = {
    username: {
        alpha: {},
        length: { min: 5, max: 15 },
    },
    password: {
        alphanumeric: {},
        length: { min: 5, max: 15 },
    },
};

const userRuleMessage = {
    alpha: "las letras no coinciden",
    length: "debe meter mas numeros ",
    alphanumeric: "debe haber solo letras y numeros",
};

export const userRequestValidate = new RequestValidator(
    "en-US",
    userRule,
    userRuleMessage
);
