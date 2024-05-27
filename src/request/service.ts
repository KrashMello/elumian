import {
  type IsAlphanumericSimbolsOptions,
  type IsAlphaOptions,
  type Locale,
} from "../type";

const alpha = {
  "es-ES": /^[a-zA-Z-.\s&,_#!*/]+$/i,
};
const alphanumeric = {
  "es-ES": /^[a-z0-9A-Z-.\s&,_#/]+$/i,
};

export function isAlphaSimbols(
  _str: string,
  locale: Locale = "es-ES",
  options: IsAlphaOptions = { ignore: "" },
): any {
  let str = _str;
  const ignore = options.ignore;

  if (ignore instanceof RegExp || typeof ignore === "string") {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, "");
    } else if (typeof ignore === "string") {
      str = str.replace(
        new RegExp(
          "[".concat(ignore.replace(/[[\]{}()*+?.,\\^$|#]/g, "\\$&"), "]"),
          "g",
        ),
        "",
      ); // escape regex for ignore
    } else {
      throw new Error("ignore should be instance of a String or RegExp");
    }
  }
  if (locale in alpha) {
    return alpha["es-ES"].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}
export function isAlphaNumericSimbols(
  _str: string,
  locale: Locale = "es-ES",
  options: IsAlphanumericSimbolsOptions = {},
): any {
  let str = _str;
  const ignore = options.ignore;

  if (ignore instanceof RegExp || typeof ignore === "string") {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, "");
    } else if (typeof ignore === "string") {
      str = str.replace(
        new RegExp(
          "[".concat(ignore.replace(/[[\]{}()*+?.,\\^$|#]/g, "\\$&"), "]"),
          "g",
        ),
        "",
      ); // escape regex for ignore
    } else {
      throw new Error("ignore should be instance of a String or RegExp");
    }
  }

  if (locale in alphanumeric) {
    return alphanumeric["es-ES"].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

export function isAlpha(
  _str: string,
  locale: Locale = "es-ES",
  options: IsAlphaOptions = {},
): any {
  let str = _str;
  const { ignore } = options;

  if (ignore instanceof RegExp || typeof ignore === "string") {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, "");
    } else if (typeof ignore === "string") {
      str = str.replace(
        new RegExp(
          `[${ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&")}]`,
          "g",
        ),
        "",
      ); // escape regex for ignore
    } else {
      throw new Error("ignore should be instance of a String or RegExp");
    }
  }

  if (locale in alpha) {
    return alpha["es-ES"].test(str);
  }
  throw new Error(`Invalid locale '${locale}'`);
}
