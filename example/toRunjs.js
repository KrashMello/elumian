const functions: schemaFunctions = {
  codegen: {
    fields: {
      type: "asdf"
    },
    comantBlock: `
      return false;
    `
  }
}

const procedure: schemaProcedure = {
  createTask: {
    fields: {
      in: {
        _name: "character varying",
        _description: "character varying"
      }
    },
    declare: {
      _code: "character varying"
    },
    comantBlock: `
      _code := codegen('task');
      Insert into tasks(code,"name",description) values (code,_name,_description);
      `
  }
}

const FA = []
const FP = []

const procedureFields = Object.keys(procedure)

procedureFields.forEach((v) => {
  let parametersKey = Object.keys(procedure[v].fields.in)
  let declareKey = Object.keys(procedure[v].declare)
  parametersKey = parametersKey.map((z) => {
    return z + "#23" + procedure[v].fields.in[z].replace(/\s/g, "#23")
  })
  declareKey = declareKey.map((z) => {
    return z + "#23" + procedure[v].declare[z].replace(/\s/g, "#23") + ";"
  })
  const result = `
  create#23or#23replace#23procedure#23"${v}"(${parametersKey})
  #23language#23plpgsql
#23as#23$$#23
#23declare#23
  ${declareKey ?? ""}
  #23begin#23
  ${procedure[v].comantBlock.replace(/(\s)\1/g, "#23").replace(/\s/g, "#23")}
end;#23$$
  `
  FP.push(result.replace(/\s/g, "").replace(/(#23)/g, " "))
})

FP
