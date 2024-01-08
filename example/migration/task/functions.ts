import { options } from '@elumian/db/schema'
import type { schemaFunctions } from '@elumian/type'

const { varchar, bigInt } = options

export const functions: schemaFunctions = {
  codegen: {
    parameters: {
      type: varchar(30),
    },
    declare: {
      _auxcode: varchar(15),
      _auxcount: bigInt,
    },
    return: varchar(15),
    comantBlock: `
      case type
		   when 'tsk' then
              select count(*) into _auxcount from task.tasks;
              select concat('TSK-',substring('0000',length(_auxcount::character varying) + 1),_auxcount+1) into _auxcode;
		   else
	    	  _auxcode = 'Unspecified';
		   end case;
      
      return _auxcode;
    `,
  },
}
