import { REGISTERS, OPCODES, INSTR_OFFSETS } from './constants_lookup_tables';
import { operations }                        from './operations.js';
import { state }                             from './state.js';

var running = function(){
  return state.registers.halt == 0;
};

var fetch = function(){
  var next = state.memory[state.registers.pc];
  state.registers.pc += 1;
  return next;
};

var decode = function(instr){
  return {
    opcode   : (instr & 0xFF000000) >>> INSTR_OFFSETS.OPCODE, 
    dest_reg : (instr & 0x00F00000) >>> INSTR_OFFSETS.DEST_REG,
    src_reg_1: (instr & 0x000F0000) >>> INSTR_OFFSETS.SRC_REG_1,
    src_reg_2: (instr & 0x0000F000) >>> INSTR_OFFSETS.SRC_REG_2,
    constant : (instr & 0x0000FFFF) >>> INSTR_OFFSETS.CONSTANT
  }; 
};

var evaluate = function(instr){
   instr.opcode    = OPCODES[instr.opcode];
   instr.dest_reg  = REGISTERS[instr.dest_reg];
   instr.src_reg_1 = REGISTERS[instr.src_reg_1];
   instr.src_reg_2 = REGISTERS[instr.src_reg_2];

   const execution_function = operations[instr.opcode];
   execution_function(state.registers,instr);
};

var main = function(){
  while(running()){
    evaluate(decode(fetch()));
  }
};


var pack_instruction = function(instruction){
  const opcode    = instruction[0];
  const dest_reg  = instruction[1];
  const src_reg_1 = instruction[2];
  const src_reg_2 = instruction[3];
  const constant  = instruction[4];

  var instr;
  var reg;
  if(opcode){
    var op = OPCODES[opcode];
    instr = pack(instr,op,INSTR_OFFSETS.OPCODE);
  }
  if(dest_reg){
    reg = REGISTERS[dest_reg];
    instr = pack(instr,reg,INSTR_OFFSETS.DEST_REG);
  } 
  if(src_reg_1){
    reg = REGISTERS[src_reg_1];
    instr = pack(instr,reg,INSTR_OFFSETS.SRC_REG_1);
  }
  if(src_reg_2){
    reg = REGISTERS[src_reg_2];
    instr = pack(instr,reg,INSTR_OFFSETS.SRC_REG_2);
  }
  if(constant){
    instr = pack(instr,constant,INSTR_OFFSETS.CONSTANT);
  }
  return instr;
};

var pack = function(instr,field,offset){
  return instr | (field << offset);
};

state.memory = [
  /*
  ["loadl", "reg1", null  , null  ,      1],
  ["loadh", "reg1", null  , null  ,      1],
  ["loadl", "reg2", null  , null  ,      2],
  ["loadh", "reg2", null  , null  ,      2],
  ["addu" , "reg3", "reg1", "reg2",   null],
  ["loadl", "reg0", null  , null  ,     16],
  ["loadl", "reg4", null  , null  ,      7],
  ["subu" , "reg5", "reg0", "reg4",   null],
  */
  /*
  ["loadl", "reg0", null  , null  , 0xFFFF],
  ["loadh", "reg0", null  , null  , 0xFFFF],
  ["loadl", "reg1", null  , null  ,      6],
  ["loadh", "reg1", null  , null  ,      0],
  ["addu" , "reg2", "reg0", "reg1",   null],
  */
  /*
  ["loadl", "reg0", null  , null  ,      5],
  ["loadl", "reg1", null  , null  ,      7],
  ["subu" , "reg2", "reg0", "reg1",   null],
  ["halt" , null  , null  , null  ,   null] 
  */
  ["loadl", "reg0", null  , null  ,      7],
  ["loadl", "reg1", null  , null  ,      7],
  ["eq" ,   "reg2", "reg0", "reg1",   null],
  ["halt" , null  , null  , null  ,   null] 
].map(pack_instruction);

main();

console.log("packing loadl reg1 5: "+ pack_instruction(["loadl","reg1",null,null,5]).toString(16));

