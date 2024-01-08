import { options } from '@elumian/db/schema'
import type { schemaProcedure } from '@elumian/type'

const { varchar, text } = options

export const procedure: schemaProcedure = {
  createTask: {
    parameters: {
      in: {
        _name: varchar(255),
        _description: text,
        _user_code: varchar(15),
      },
    },
    declare: {
      _code: varchar(15),
    },
    comantBlock: `
      select task.codegen('tsk') into _code;
      Insert into tasks(code,user_code,"name",description) values (_code,_user_code,_name,_description);
      `,
  },
  updateTask: {
    parameters: {
      in: {
        _code: varchar(15),
        _name: varchar(255),
        _description: text,
      },
    },
    comantBlock: `
      update "task"."tasks"
		set  "name" = _name,
		description = _description,
		updated_at = now()
	where code = _code;
      `,
  },
}
