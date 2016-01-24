import { ALL_REGISTERS_LIST } from './registers.js';

const initialize_registers = function(){
  let registers = {};
  for(let i = 0; i < ALL_REGISTERS_LIST.length; i++ ) {
    let reg_name = ALL_REGISTERS_LIST[i][0];
    registers[reg_name] = 0;
  }

  return registers;
};

export const state = {
  registers: initialize_registers(),
  memory: []
};

