import validator from "validator";

export class RequestValidator {
  constructor(locale, options, message) {
    this.locale = locale;
    this.options = options;
    this.message = message;
  }

  getResult(query) {
    let optionsKeys = Object.keys(this.options);
    let queryKeys = Object.keys(query);
    let optionsValues = Object.values(this.options);
    let queryValues = Object.values(query);
    let temKey = null;
    let temValues = null;
    let result = optionsKeys.map((value, key) => {
      if (value === queryKeys[key]) {
        temKey = Object.keys(optionsValues[key]);
        temValues = Object.values(optionsValues[key]);
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
  #findValidator(type, options, str) {
    let validate = true;
    let result = [];
    result = type.map((value, key) => {
      if (typeof value === "string")
        switch (value) {
          case "alpha":
            return {
              valid: validator.isAlpha(str, this.locale, options[key]),
              messaje: validator.isAlpha(str, this.locale, options[key])
                ? "success"
                : this.message.alpha || "el campo solo debe contener letras",
            };
          case "length":
            return {
              valid: validator.isLength(str, options[key]),
              messaje: validator.isLength(str, options[key])
                ? "success"
                : this.message.length ||
                  `el campo debe tener al menos ${options[key].min} y maximo ${options[key].max} caracteres`,
            };

          case "alphanumeric":
            return {
              valid: validator.isAlphanumeric(str, this.locale, options[key]),
              messaje: validator.isAlphanumeric(str, this.locale, options[key])
                ? "success"
                : this.message.alphanumeric || "el campo solo debe contener letras y numeros",
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
