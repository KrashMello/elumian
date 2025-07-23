import { type IsAlphaOptions, type Locale } from "./type";

const alpha = {
  "es-ES": /^[a-zA-Z-.\s&,_#!*/]+$/i,
};
const alphanumeric = {
  "es-ES": /^[a-z0-9A-Z-.\s&,_#/]+$/i,
};

const FORMATS = [
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "DD-MM-YYYY",
  "DD/MM/YYYY",
  "MM-DD-YYYY",
  "MM/DD/YYYY",
];

export function isDate(dateString: string, format: string): boolean {
  const formatIndex = FORMATS.indexOf(format);
  if (formatIndex === -1) {
    throw new Error(`Invalid date format: ${format}`);
  }

  const parts = dateString.split(/[-/]/);
  if (parts.length !== 3) {
    return false;
  }

  const year = parseInt(
    parts[formatIndex === 0 || formatIndex === 1 ? 0 : 2],
    10,
  );
  const month = parseInt(
    parts[formatIndex === 0 || formatIndex === 3 ? 1 : 0],
    10,
  );
  const day = parseInt(
    parts[formatIndex === 0 || formatIndex === 1 ? 2 : 1],
    10,
  );

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

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
  options: any = {},
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
