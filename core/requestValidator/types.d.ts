export interface Message {
  alphanumeric?: string;
  alpha?: string;
  notNull?: string;
  length?: string;
}
export type Locale =
  | "en-US"
  | "bg-BG"
  | "cs-CZ"
  | "da-DK"
  | "de-DE"
  | "el-GR"
  | "es-AR"
  | "es-ES"
  | "fr-FR"
  | "it-IT"
  | "nb-NO"
  | "nl-NL"
  | "nn-NO"
  | "hu-HU"
  | "pl-PL"
  | "pt-PT"
  | "ru-RU"
  | "sl-SI"
  | "sk-SK"
  | "sr-RS@latin"
  | "sr-RS"
  | "sv-SE"
  | "tr-TR"
  | "uk-UA"
  | "ku-IQ"
  | "ar"
  | "he"
  | "fa-IR"
  | "en-AU"
  | "en-GB"
  | "en-HK"
  | "en-IN"
  | "en-NZ"
  | "en-ZA"
  | "en-ZM"
  | "ar-AE"
  | "ar-BH"
  | "ar-DZ"
  | "ar-EG"
  | "ar-IQ"
  | "ar-JO"
  | "ar-KW"
  | "ar-LB"
  | "ar-LY"
  | "ar-MA"
  | "ar-QM"
  | "ar-QA"
  | "ar-SA"
  | "ar-SD"
  | "ar-SY"
  | "ar-TN"
  | "ar-YE"
  | "pt-BR"
  | "pl-Pl";
export interface IsAlphaOptions {
  /**
   * @default undefined
   */
  ignore?: string | RegExp | undefined;
}
export interface IsLengthOptions {
  /**
   * @default 0
   */
  min?: number | undefined;
  /**
   * @default undefined
   */
  max?: number | undefined;
}

export interface ResponseValidate {
  status: number;
  message?: string;
}
