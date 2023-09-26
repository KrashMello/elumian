import { type schemaTables } from "@DB/type";
import { options } from '@DB/schema'

const { pk, unique, varchar, notNull, bigInt, ref, text, increment } =
  options

export const tables: schemaTables = {
  Users: {
    id: [bigInt, pk, increment, notNull],
    code: [varchar(15), unique],
    username: [varchar(20), notNull, unique],
    password: [varchar(150), notNull],
    first_name: [varchar(50), notNull],
    last_name: [varchar(50), notNull],
    email: [varchar(100), notNull],
    status_code: [varchar(15), notNull, ref("-", `system.roles.code`)],
    role_code: [varchar(15), notNull, ref("-", `system.status.code`)]
  },
  roles: {
    id: ['SMALLINT', pk, increment, notNull],
    code: [varchar(15), unique],
    name: [varchar(50), notNull],
    description: [text]
  },
  status: {
    id: ['SMALLINT', pk, increment, notNull],
    code: [varchar(15), unique],
    name: [varchar(50), notNull],
    description: [text]
  }
}
