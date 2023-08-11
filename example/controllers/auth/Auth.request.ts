import { RequestClass } from '@Request/index'

const signInOptions = {
  username: 'required|max:20|min:5|alpha',
  password: 'required|max:20|min:7|alphaSimbols'
}

export const signInRequest = new RequestClass(signInOptions)
