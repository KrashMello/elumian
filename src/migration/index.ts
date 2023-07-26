import { Schema, options } from "@DB/schema";

let { smallInt, pk, increment } = options
let schema = new Schema()

let tables = {
  blog: {
    id: [smallInt, pk, increment]
  },
  user: {
    id: [smallInt, pk, increment]
  }
}

schema.create('public', tables)
