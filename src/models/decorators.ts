import express from 'express'
const app = express.Router()

export function log (target: any, propertyKey: any) {
  console.log(target, propertyKey)
}

export function configurable (value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(target, propertyKey)
    app.get('/', descriptor.value)
    descriptor.configurable = value
  }
}
