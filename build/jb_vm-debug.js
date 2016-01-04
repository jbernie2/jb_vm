"use strict";

var OPCODE_OFFSET = 24;
var DEST_REG_OFFSET = 20;
var SRC_REG_1_OFFSET = 16;
var SRC_REG_2_OFFSET = 12;
var CONSTANT_OFFSET = 0;

//look up OPCODE names by value
var OPCODE_NAMES = ["halt", // 0x00 //
"add", // 0x01 //
"loadi" // 0x02 //
];

//look up OPCODE values by name
var OPCODE_VALUES = {
  halt: 0x00,
  add: 0x01,
  loadi: 0x02
};

var REGISTERS = {
  //general purpose registers
  reg0: 0x0,
  reg1: 0x1,
  reg2: 0x2,
  reg3: 0x3,
  reg4: 0x4,
  reg5: 0x5,
  reg6: 0x6,
  reg7: 0x7,

  //special purpose registers
  reg8: 0x8,
  reg9: 0x9,
  rega: 0xa,
  regb: 0xb,
  //pointer to video memory
  vm: 0xc,
  //pointer to interupt handler
  ih: 0xd,
  //stack pointer
  sp: 0xe,
  //program counter
  pc: 0xf
};

var pc = 0;
var running = true;
var stack = [];
var registers = {
  reg0: 0,
  reg1: 1,
  reg2: 2,
  reg3: 3,
  reg4: 4,
  reg5: 5,
  reg6: 6,
  reg7: 7,

  reg8: 8,
  reg9: 9,
  rega: 10,
  regb: 11,
  vm: 12,
  ih: 13,
  sp: 14,
  pc: 0
};

var halt = function halt(instr) {
  running = false;
  console.log("halting");
};

var add = function add(instr) {
  console.log("add");
};

var loadi = function loadi(instr) {
  console.log("loadi");
};

var instructions = {
  halt: halt,
  loadi: loadi,
  add: add
};

var fetch = function fetch() {
  var next = memory[registers.pc];
  registers.pc += 1;
  return next;
};

var decode = function decode(instr) {
  return {
    opcode: (instr & 0xFF000000) >>> OPCODE_OFFSET,
    dest_reg: (instr & 0x00F00000) >>> DEST_REG_OFFSET,
    src_reg_1: (instr & 0x000F0000) >>> SRC_REG_1_OFFSET,
    src_reg_2: (instr & 0x0000F000) >>> SRC_REG_2_OFFSET,
    constant: (instr & 0x0000FFFF) >>> CONSTANT_OFFSET
  };
};

var evaluate = function evaluate(instr) {
  var op = OPCODE_NAMES[instr.opcode];
  var execution_function = instructions[op];
  execution_function(instr);
};

var main = function main() {
  while (running) {
    evaluate(decode(fetch()));
  }
};

var pack_instruction = function pack_instruction(instruction) {
  var opcode = instruction[0];
  var dest_reg = instruction[1];
  var src_reg_1 = instruction[2];
  var src_reg_2 = instruction[3];
  var constant = instruction[4];

  var instr;
  var reg;
  if (opcode) {
    var op = OPCODE_VALUES[opcode];
    instr = pack(instr, op, OPCODE_OFFSET);
  }
  if (dest_reg) {
    reg = REGISTERS[dest_reg];
    instr = pack(instr, reg, DEST_REG_OFFSET);
  }
  if (src_reg_1) {
    reg = REGISTERS[src_reg_1];
    instr = pack(instr, reg, SRC_REG_1_OFFSET);
  }
  if (src_reg_2) {
    reg = REGISTERS[src_reg_2];
    instr = pack(instr, reg, SRC_REG_2_OFFSET);
  }
  if (constant) {
    instr = pack(instr, constant, CONSTANT_OFFSET);
  }
  return instr;
};

var pack = function pack(instr, field, offset) {
  return instr | field << offset;
};

var memory = [["loadi", "reg1", null, null, 1], ["loadi", "reg2", null, null, 2], ["add", "reg3", "reg1", "reg2", null], ["halt", null, null, null, null]].map(pack_instruction);

main();

console.log("packing loadi reg1 5: " + pack_instruction(["loadi", "reg1", null, null, 5]).toString(16));
//# sourceMappingURL=jb_vm-debug.js.map
