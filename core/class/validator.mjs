import validator from "validator";

export class RequestValidator {
  constructor(locale, rules, message) {
    this.locale = locale;
    this.rules = rules;
    this.message = message;
  }

  getResult(query) {
    let rulesKeys = Object.keys(this.rules);
    let queryKeys = Object.keys(query);
    let rulesValues = Object.values(this.rules);
    let queryValues = Object.values(query);
    let temKey = null;
    let temValues = null;
    let result = rulesKeys.map((value, key) => {
      if (value === queryKeys[key]) {
        temKey = Object.keys(rulesValues[key]);
        temValues = Object.values(rulesValues[key]);
        return this.#findValidator(temKey, temValues, queryValues[key]);
      }
    });
    let index = result.findIndex((value) => {
      return value.status == "error";
    });
    if (index > -1)
      return result.find((value) => {
        return value.status == "error";
      });
    else return { status: "ok" };
  }
  #findValidator(type, rules, str) {
    let validate = true;
    let result = [];
    result = type.map((value, key) => {
      if (typeof value === "string")
        switch (value) {
          case "alpha":
            return {
              valid: validator.isAlpha(str, this.locale, rules[key]),
              messaje: validator.isAlpha(str, this.locale, rules[key])
                ? "success"
                : this.message.alpha || "el campo solo debe contener letras",
            };
          case "length":
            return {
              valid: validator.isLength(str, rules[key]),
              messaje: validator.isLength(str, rules[key])
                ? "success"
                : this.message.length ||
                  `el campo debe tener al menos ${rules[key].min} y maximo ${rules[key].max} caracteres`,
            };

          case "alphanumeric":
            return {
              valid: validator.isAlphanumeric(str, this.locale, rules[key]),
              messaje: validator.isAlphanumeric(str, this.locale, rules[key])
                ? "success"
                : this.message.alphanumeric ||
                  "el campo solo debe contener letras y numeros",
            };
          default:
            console.log("no exists");
        }
      else console.log("error the typeof no is sting");
    });
    result.forEach((value) => {
      if (!value.valid) validate = { status: "error", messaje: value.messaje };
      else validate = { status: "ok" };
    });
    return validate;
  }
}
