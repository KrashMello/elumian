import { type Message } from '../type';
export declare class RequestValidator {
    private readonly lang;
    private readonly optionsToValidate;
    private readonly message;
    constructor(optionsToValidate: Record<string, string>, message?: Message);
    validate(get?: boolean): any;
    private compareValue;
}
