let optionsToValidate = {
  username: 'required|max:15|min:8|alpha',
  password: 'required|max:50|min:8|alphaNumeric',
}

let default_message = {
  alpha: 'el mensaje debe ser solo letrerico',
}

let data = {
  username: null,
  password: 'password)',
}

function validate(data) {
  compareValue(data, optionsToValidate)
}

function compareValue(
  data,
  optionsToValidate,
  message: { [key: string]: string } = {}
) {
  let dataKey = Object.keys(data)
  let requestKey = Object.keys(optionsToValidate)
  if (!_.isEqual(dataKey, requestKey))
    return console.log(`campos unicamente necesarios: ${requestKey.toString()}`)

  let requestResult = {}

  requestKey.map((key) => {
    let options = optionsToValidate[key].split('|')
    let optionsResult = []

    optionsResult = options
      .map((option) => {
        let result: string | null = null
        let min_max_length
        if (option.includes('max') || option.includes('min')) {
          let auxOption = option.split(':')
          option = auxOption[0]
          min_max_length = Number(auxOption[1])
        }
        switch (option) {
          case 'alpha':
            if (!/^[a-zA-Z]+$/g.test(data[key]))
              result = message?.alpha || 'el campo solo debe tener letras!'
            break
          case 'required':
            if (!data[key])
              result = message?.required || 'el campo es requerido'
            break
          case 'max':
            if (!data[key] || data[key].length > min_max_length)
              result =
                message?.max ||
                `el campo no debe tener mas de ${min_max_length} caracteres`
            break
          case 'min':
            if (!data[key] || data[key].length < min_max_length)
              result =
                message?.min ||
                `el campo no debe tener menos de ${min_max_length} caracteres`
            break
          case 'alphaNumeric':
            if (!/^[a-zA-Z1-9]+$/g.test(data[key]))
              result =
                message?.min || `el campo solo debe tener letras y numeros`
            break
          default:
            result
        }
        return result
      })
      .filter((v) => v)
    if (optionsResult.length > 0)
      requestResult = { ...requestResult, [key]: optionsResult }
  })
  return requestResult
}

console.log(validate(data))
