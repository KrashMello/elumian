import { options } from '@DB/schema'
import type { schemaProcedure } from '@DB/type'

const { varchar, text } =
  options

export const procedure: schemaProcedure = {
  createUser: {
    parameters: {
      in: {
        _username: varchar(20),
        _password: varchar(150),
        _first_name: varchar(50),
        _last_name: varchar(50),
        _email: varchar(100),
        _status_code: varchar(15),
        _role_code: varchar(15)
      }
    },
    declare: {
      _code: varchar(15)
    },
    comantBlock: `
      select system.codegen('usr') into _code;
      Insert into system."Users"(code, username, password, first_name, last_name, email, status_code, role_code) values (_code, _username,_password,_first_name,_last_name,_email,_status_code,_role_code);
      `
  },
  updateUser: {
    parameters: {
      in: {
        _code: varchar(15),
        _first_name: varchar(50),
        _last_name: varchar(50),
      }
    },
    comantBlock: `
      update "system"."Users"
		first_name = _first_name,
    last_name = _last_name,
		updated_at = now()
	where code = _code;
      `
  },
  createRole: {
    parameters: {
      in: {
        _name: varchar(255),
        _description: text
      }
    },
    declare: {
      _code: varchar(15)
    },
    comantBlock: `
      select system.codegen('rle') into _code;
      Insert into system.roles(code, "name", description ) values (_code, _name, _description);
      `
  },
  updateRole: {
    parameters: {
      in: {
        _code: varchar(15),
        _name: varchar(255),
        _description: text,
      }
    },
    comantBlock: `
      update "system".roles
		set  "name" = _name,
    description = _description,
		updated_at = now()
	where code = _code;
      `
  },
  createStatus: {
    parameters: {
      in: {
        _name: varchar(255),
        _description: text
      }
    },
    declare: {
      _code: varchar(15)
    },
    comantBlock: `
      select system.codegen('stts') into _code;
      Insert into system.status(code, "name", description ) values (_code, _name, _description);
      `
  },
  updateStatus: {
    parameters: {
      in: {
        _code: varchar(15),
        _name: varchar(255),
        _description: text,
      }
    },
    comantBlock: `
      update "system".status
		set  "name" = _name,
    description = _description,
		updated_at = now()
	where code = _code;
      `
  }



}
