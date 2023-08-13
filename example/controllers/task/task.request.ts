import { RequestClass } from '@Request/index'

const findDataOptions = {
  code: 'max:10|alphaNumericSimbols',
  description: 'alphaNumericSimbols|max:500',
  name: 'max:255|alphaNumericSimbols'
}

const createTaskOptions = {
  description: 'alphaNumericSimbols|max:500',
  name: 'required|min:7|max:255|alphaNumericSimbols'
}

const updateTaskOptions = {
  description: 'alphaNumericSimbols|max:500',
  name: 'required|min:7|max:255|alphaNumericSimbols'
}

export const findDataRequest = new RequestClass(findDataOptions).validate(true)
export const createTaskRequest = new RequestClass(createTaskOptions).validate()
export const updateTaskRequest = new RequestClass(updateTaskOptions).validate()

