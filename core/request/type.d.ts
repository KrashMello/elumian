interface Message {
  alpha?: string
  alphaSimbols?: string
  alphaNumeric?: string
  alphaNumericSimbols?: string
  numeric?: string
  required?: string
  boolean?: string
  min?: string
  max?: string
  array?: string
  email?: string
}

export type dataCompareValueRequest = { [key: string]: any }

export type returnCompareValue =
  | true
  | string
  | { [key: string]: Array<string> }

export interface IsAlphaSimbolsOptions {
  ignore?: string
}

export type IsAlphanumericSimbolsOptions = pick<IsAlphaSimbols>

export type Locale =
  | 'en-US'
  | 'bg-BG'
  | 'cs-CZ'
  | 'da-DK'
  | 'de-DE'
  | 'el-GR'
  | 'es-AR'
  | 'es-ES'
  | 'fr-FR'
  | 'it-IT'
  | 'nb-NO'
  | 'nl-NL'
  | 'nn-NO'
  | 'hu-HU'
  | 'pl-PL'
  | 'pt-PT'
  | 'ru-RU'
  | 'sl-SI'
  | 'sk-SK'
  | 'sr-RS@latin'
  | 'sr-RS'
  | 'sv-SE'
  | 'tr-TR'
  | 'uk-UA'
  | 'ku-IQ'
  | 'ar'
  | 'he'
  | 'fa-IR'
  | 'en-AU'
  | 'en-GB'
  | 'en-HK'
  | 'en-IN'
  | 'en-NZ'
  | 'en-ZA'
  | 'en-ZM'
  | 'ar-AE'
  | 'ar-BH'
  | 'ar-DZ'
  | 'ar-EG'
  | 'ar-IQ'
  | 'ar-JO'
  | 'ar-KW'
  | 'ar-LB'
  | 'ar-LY'
  | 'ar-MA'
  | 'ar-QM'
  | 'ar-QA'
  | 'ar-SA'
  | 'ar-SD'
  | 'ar-SY'
  | 'ar-TN'
  | 'ar-YE'
  | 'pt-BR'
  | 'pl-Pl'

export interface IsAlphaOptions {
  /**
   * @default undefined
   */
  ignore?: string | RegExp | undefined
}

export interface IsLengthOptions {
  /**
   * @default 0
   */
  min?: number | undefined
  /**
   * @default undefined
   */
  max?: number | undefined
}

export interface IsNumericOptions {
  /**
   * If `no_symbols` is true, the validator will reject numeric strings that feature a symbol (e.g. `+`, `-`, or `.`).
   *
   * @default false
   */
  no_symbols?: boolean | undefined
  locale?: AlphaLocale | undefined
}

export interface IsEmailOptions {
  /**
   * If `allow_display_name` is set to `true`, the validator will also match `Display Name <email-address>`.
   *
   * @default false
   */
  allow_display_name?: boolean | undefined
  /**
   * If `require_display_name` is set to `true`, the validator will reject strings without the format `Display Name <email-address>`.
   *
   * @default false
   */
  require_display_name?: boolean | undefined
  /**
   * If `allow_utf8_local_part` is set to `false`, the validator will not allow any non-English UTF8 character in email address' local part.
   *
   * @default true
   */
  allow_utf8_local_part?: boolean | undefined
  /**
   * If `require_tld` is set to `false`, e-mail addresses without having TLD in their domain will also be matched.
   *
   * @default true
   */
  require_tld?: boolean | undefined
  /**
   * If `ignore_max_length` is set to `true`, the validator will not check for the standard max length of an email.
   *
   * @default false
   */
  ignore_max_length?: boolean | undefined
  /**
   * If `allow_ip_domain` is set to `true`, the validator will allow IP addresses in the host part.
   *
   * @default false
   */
  allow_ip_domain?: boolean | undefined
  /**
   * If `domain_specific_validation` is `true`, some additional validation will be enabled,
   * e.g. disallowing certain syntactically valid email addresses that are rejected by GMail.
   *
   * @default false
   */
  domain_specific_validation?: boolean | undefined
  /**
   *  If host_blacklist is set to an array of strings
   *  and the part of the email after the @ symbol matches one of the strings defined in it,
   *  the validation fails.
   */
  host_blacklist?: string[] | undefined
  /**
   *  If blacklisted_chars receives a string, then the validator will reject emails that include
   *  any of the characters in the string, in the name part.
   */
  blacklisted_chars?: string | undefined
}

export interface isBooleansOptions {
  /**
   * If loose is is set to false, the validator will strictly match ['true', 'false', '0', '1'].
   * If loose is set to true, the validator will also match 'yes', 'no', and will match a valid boolean string of any case. (eg: ['true', 'True', 'TRUE']).
   * @default false
   */
  loose?: boolean | undefined
}

export interface ResponseValidate {
  status: number
  message?: string
}
