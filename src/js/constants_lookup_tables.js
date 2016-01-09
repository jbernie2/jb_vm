import REGISTERS from './registers';
import OPCODES from './opcodes';

const two_way_lookup_table = function(values){
  var lookup = {};
  values.forEach(function(a){
    lookup[a[0]] = a[1];
    lookup[a[1]] = a[0];
  });
  return lookup;
};

export const REGISTER_LOOKUP = two_way_lookup_table(REGISTERS);
export const OPCODE_LOOKUP = two_way_lookup_table(OPCODES);
