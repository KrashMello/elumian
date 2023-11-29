import express from 'express'
const app = express.Router()

export function log(): MethodDecorator {
  return (target, propertyKey) => {
    console.log(target, propertyKey)
  }
}

export function configurable(value: boolean): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    console.log(target, propertyKey)
    app.get('/', descriptor.value)
    descriptor.configurable = value
  }
}
