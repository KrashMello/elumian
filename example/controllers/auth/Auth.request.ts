import { RequestClass } from '@Request/index'

const signInOptions = {
  username: 'required|max:20|min:5|alpha',
  password: 'required|max:20|min:7|alphaSimbols'
}

const signUpOptions = {
  username: 'required|max:20|min:5|alpha',
  password: 'required|max:20|min:7|alphaSimbols',
  email: 'required|max:255|min:10|email',
  first_name: 'required|max:50|min:4|alpha',
  last_name: 'required|max:50|min:4|alpha'
}

export const signInRequest = new RequestClass(signInOptions).validate()
export const signUpRequest = new RequestClass(signUpOptions).validate()
