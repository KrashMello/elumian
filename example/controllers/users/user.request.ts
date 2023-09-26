import { RequestClass } from '@Request/index'

const findDataOptions = {
  code: 'max:15|alphaNumericSimbols',
  username: 'max:20|alpha',
  email: 'email',
  firstName: 'alpha|max:50',
  lastName: 'alpha|max:50',
}

const createUserOptions = {
  username: 'required|max:20|alpha',
  password: 'required|max:150|alphaNumericSimbols|min:8',
  email: 'required|email',
  firstName: 'required|alpha|max:50',
  lastName: 'required|alpha|max:50',
  statusCode: 'required|alphaNumericSimbols|max:15',
  roleCode: 'required|alphaNumericSimbols|max:15',
}

const updateUserOptions = {
  code: 'max:15|alphaNumericSimbols',
  firstName: 'required|alpha|max:50',
  lastName: 'required|alpha|max:50',
}

export const findDataRequest = new RequestClass(findDataOptions).validate(true)
export const createUserRequest = new RequestClass(createUserOptions).validate()
export const updateUserRequest = new RequestClass(updateUserOptions).validate()

