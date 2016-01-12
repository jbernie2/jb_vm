import {REGISTERS, OPCODES, INSTR_OFFSETS} from './constants_lookup_tables';
console.log(REGISTERS);
console.log(OPCODES);

console.log("0x0: "+REGISTERS[0x0]);
console.log("reg0: "+REGISTERS["reg0"]);


var pc = 0;
var running = true;
var stack = [];
var registers = {
  reg0:0,
  reg1:1,
  reg2:2,
  reg3:3,
  reg4:4,
  reg5:5,
  reg6:6,
  reg7:7,

  reg8:8,
  reg9:9,
  rega:10,
  regb:11,
  vm:12,
  ih:13,
  sp:14,
  pc:0
};


var halt = function(instr){
  running = false;
  console.log("halting");
};

var add = function(instr){
  console.log("add");
};

var loadl = function(instr){
  console.log("loadl");
};

const instructions = {
  halt:halt,
  loadl:loadl,
  add:add
};

var fetch = function(){
  var next = memory[registers.pc];
  registers.pc += 1;
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
   const op = OPCODES[instr.opcode];
   const execution_function = instructions[op];
   execution_function(instr);
};

var main = function(){
  while(running){
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

var memory = [
  ["loadl", "reg1", null  , null  , 1],
  ["loadl", "reg2", null  , null  , 2],
  ["add"  , "reg3", "reg1", "reg2", null],
  ["halt" , null  , null  , null  , null] 
].map(pack_instruction);

main();

console.log("packing loadl reg1 5: "+ pack_instruction(["loadl","reg1",null,null,5]).toString(16));

