import { Request } from '@Request/index'

let signInOptions = {
  username: 'required|max:20|min:5|alpha',
  password: 'required|max:20|min:7|alphaSimbols',
}

export let signInRequest = new Request(signInOptions)
