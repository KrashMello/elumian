import { options } from '@DB/schema'
import type { schemaTables } from '@DB/type'
const { pk, unique, varchar, notNull, bigInt, text, increment, ref } =
  options

export const tables: schemaTables = {
  tasks: {
    id: [bigInt, pk, increment, notNull],
    code: [varchar(15), unique],
    user_code: [varchar(15), ref(">", `system.users.code`)],
    name: [varchar(255), notNull],
    description: [text, notNull]
  },
}
