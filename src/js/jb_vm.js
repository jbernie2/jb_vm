import {REGISTERS, OPCODES, INSTR_OFFSETS} from './constants_lookup_tables';
console.log(REGISTERS);
console.log(OPCODES);

var pc = 0;
var running = true;
var stack = [];
var registers = {
  reg0:0,
  reg1:0,
  reg2:0,
  reg3:0,
  reg4:0,
  reg5:0,
  reg6:0,
  reg7:0,

  reg8:0,
  reg9:0,
  rega:0,
  regb:0,
  vm:0,
  ih:0,
  sp:0,
  pc:0
};


var halt = function(instr){
  running = false;
  console.log("halting");
};

//TODO: handle overflow, wrap around
var addi = function(instr){
  registers[instr.dest_reg] = 
    registers[instr.src_reg_1] + registers[instr.src_reg_2];
};

//TODO: handle underflow eg. less than 0, wrap around
var subi = function(instr){
  registers[instr.dest_reg] = 
    registers[instr.src_reg_1] - registers[instr.src_reg_2];
};

var loadl = function(instr){
  //clear low 2 bytes
  registers[instr.dest_reg] = (registers[instr.dest_reg] & 0xFF00) 
  
  //replace low 2 bytes with constant
  registers[instr.dest_reg] = 
    registers[instr.dest_reg] | instr.constant;
};

var loadh = function(instr){
  //clear high 2 bytes
  registers[instr.dest_reg] = (registers[instr.dest_reg] & 0x00FF) 

  //shift constant two bytes
  instr.constant = instr.constant << 16;
  
  //replace high 2 bytes with constant
  registers[instr.dest_reg] = 
    registers[instr.dest_reg] | instr.constant;
};

const instructions = {
  halt:halt,
  loadl:loadl,
  addi:addi,
  subi:subi,
  loadh:loadh
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
   instr.opcode    = OPCODES[instr.opcode];
   instr.dest_reg  = REGISTERS[instr.dest_reg];
   instr.src_reg_1 = REGISTERS[instr.src_reg_1];
   instr.src_reg_2 = REGISTERS[instr.src_reg_2];

   const execution_function = instructions[instr.opcode];
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
  ["loadl", "reg1", null  , null  ,    1],
  ["loadh", "reg1", null  , null  ,    1],
  ["loadl", "reg2", null  , null  ,    2],
  ["loadh", "reg2", null  , null  ,    2],
  ["addi" , "reg3", "reg1", "reg2", null],
  ["loadl", "reg0", null  , null  ,   16],
  ["loadl", "reg4", null  , null  ,    7],
  ["subi" , "reg5", "reg0", "reg4", null],
  ["halt" , null  , null  , null  , null] 
].map(pack_instruction);

main();

console.log("packing loadl reg1 5: "+ pack_instruction(["loadl","reg1",null,null,5]).toString(16));

