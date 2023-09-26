import type { schemaFunctions } from "@DB/type";
import { options } from '@DB/schema'

const { varchar, bigInt, } =
  options
export const functions: schemaFunctions = {
  codegen: {
    parameters: {
      type: varchar(30)
    },
    declare: {
      _auxcode: varchar(15),
      _auxcount: bigInt
    },
    return: varchar(15),
    comantBlock: `
      case type
		   when 'usr' then
              select count(*) into _auxcount from "system"."Users";
              select concat('USR-',substring('0000',length(_auxcount::character varying) + 1),_auxcount+1) into _auxcode;
      when 'rle' then
          select count(*) into _auxcount from "system"."roles";
          select concat('RLE-',substring('0000',length(_auxcount::character varying) + 1),_auxcount+1) into _auxcode;
      when 'stts' then
          select count(*) into _auxcount from "system"."status";
          select concat('STTS-',substring('0000',length(_auxcount::character varying) + 1),_auxcount+1) into _auxcode;
		   else
	    	  _auxcode = 'Unspecified';
		   end case;
      
      return _auxcode;
    `
  }
}
