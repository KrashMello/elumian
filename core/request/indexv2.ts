  
getResult(query: object) {
    let rulesKeys = Object.keys(this.rules)
    let queryKeys = Object.keys(query)
    let rulesValues = Object.values(this.rules)
    let queryValues = Object.values(query)
    let temKey: string[] = []
    let temValues: string[] = []
    let result = queryKeys.map((value, i) => {
      if (rulesKeys.filter((v) => v === value).length > 0) {
        temKey = Object.keys(
          rulesValues[rulesKeys.findIndex((v) => v === value)]
        )
        temValues = Object.values(
          rulesValues[rulesKeys.findIndex((v) => v === value)]
        )

        return this.findValidator(temKey, temValues, queryValues[i])
      } else return [{ status: 1, message: 'Invalid param' }]
    })
    let response = queryKeys
      .map((v, i) => {
        return [v, result[i]]
      })
      .filter((v) => {
        let r: object[] = v[1] as object[]
        // console.log(r);
        if (r.length > 0) return v
        else return null
      })
    return Object.fromEntries(response)
  }

