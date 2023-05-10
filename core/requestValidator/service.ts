import { IsAlphanumericSimbolsOptions, IsAlphaOptions, Locale } from "./types";

const alpha = {
  "en-US": /^[A-Z\-\s/_]+$/i,
};
const alphanumeric = {
  "en-US": /^[0-9A-Z\-\s/_]+$/i,
};

export function isAlphaSimbols(
  _str: string,
  locale: Locale,
  options: IsAlphaOptions
) {
  var str = _str;
  var ignore = options.ignore;

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, "");
    } else if (typeof ignore === "string") {
      str = str.replace(
        new RegExp(
          "[".concat(ignore.replace(/[[\]{}()*+?.,\\^$|#]/g, "\\$&"), "]"),
          "g"
        ),
        ""
      ); // escape regex for ignore
    } else {
      throw new Error("ignore should be instance of a String or RegExp");
    }
  }
  if (locale in alpha) {
    return alpha["en-US"].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}
export function isAlphanumericSimbols(
  _str: string,
  locale: Locale,
  options: IsAlphanumericSimbolsOptions
) {
  var str = _str;
  var ignore = options.ignore;

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, "");
    } else if (typeof ignore === "string") {
      str = str.replace(
        new RegExp(
          "[".concat(ignore.replace(/[[\]{}()*+?.,\\^$|#]/g, "\\$&"), "]"),
          "g"
        ),
        ""
      ); // escape regex for ignore
    } else {
      throw new Error("ignore should be instance of a String or RegExp");
    }
  }

  if (locale in alphanumeric) {
    return alphanumeric["en-US"].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

export function isAlpha(
  _str: string,
  locale: Locale = "en-US",
  options: IsAlphaOptions = {}
) {
  let str = _str;
  const { ignore } = options;

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, "");
    } else if (typeof ignore === "string") {
      str = str.replace(
        new RegExp(
          `[${ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&")}]`,
          "g"
        ),
        ""
      ); // escape regex for ignore
    } else {
      throw new Error("ignore should be instance of a String or RegExp");
    }
  }

  if (locale in alpha) {
    return alpha["en-US"].test(str);
  }
  throw new Error(`Invalid locale '${locale}'`);
}
