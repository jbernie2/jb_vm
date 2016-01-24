import {OFFSET_LIST} from './instruction_constants.js'
import {REGISTER_LIST} from './registers';
import {OPCODE_LIST} from './opcodes';

const two_way_lookup_table = function(values){
  var lookup = {};
  values.forEach(function(a){
    lookup[a[0]] = a[1];
    lookup[a[1]] = a[0];
  });
  return lookup;
};

export const INSTR_OFFSETS = OFFSET_LIST;
export const REGISTERS     = two_way_lookup_table(REGISTER_LIST);
export const OPCODES       = two_way_lookup_table(OPCODE_LIST);
