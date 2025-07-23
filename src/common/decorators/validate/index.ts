import type { validationsOptions, validationsMessage } from "../../request/type";
const validateMapping = (type: string) => (dataValidations: validationsOptions, messages?: validationsMessage) => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata("dataValitations" + [...type].map((c, i) => { if (i === 0) return c.toUpperCase(); else return c; }).join(''), dataValidations, descriptor.value)
    Reflect.defineMetadata("ValidationsMessage", messages, descriptor.value)
    return descriptor;
  }
}
export const ValidateBody = validateMapping("body")
export const ValidateQuery = validateMapping("query")
export const ValidateParams = validateMapping("params")

