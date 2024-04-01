import { type Locale, type Message } from "../type";
export declare class RequestValidator {
    readonly lang: Locale;
    readonly optionsToValidate: Record<string, string>;
    readonly message: Message;
    constructor(options: Record<string, string>, message?: Message);
    validate(get?: boolean): any;
    private compareValue;
}
