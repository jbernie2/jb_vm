(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//All instructions are 32 bit
//There are currently two instruction formats

//the first instruction layout is for moving information between registers
// byte 0:  | 8 bit instruction     |
// byte 1:  | 4 bit register number | 4 bit register number |
// byte 2:  | 4 bit register number | 4 bits unused         |
// byte 3:  | 8 bits unused         |

//the second instruction layout is for loading information into registers
// byte 0    :  | 8 bit instruction     |
// byte 1    :  | 4 bit register number | 4 bits unused         |
// byte 2 - 3:  | 16 bit constant number                        |

//offsets for each field in the instructions
//used for extracting information from the instructions
"use strict";

exports.__esModule = true;
var OFFSET_LIST = {
  OPCODE: 24,
  DEST_REG: 20,
  SRC_REG_1: 16,
  SRC_REG_2: 12,
  CONSTANT: 0
};
exports.OFFSET_LIST = OFFSET_LIST;

},{}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _INSTRUCTION_CONSTANTSJs = require('./INSTRUCTION_CONSTANTS.js');

var _registers = require('./registers');

var _opcodes = require('./opcodes');

var two_way_lookup_table = function two_way_lookup_table(values) {
  var lookup = {};
  values.forEach(function (a) {
    lookup[a[0]] = a[1];
    lookup[a[1]] = a[0];
  });
  return lookup;
};

var INSTR_OFFSETS = _INSTRUCTION_CONSTANTSJs.OFFSET_LIST;
exports.INSTR_OFFSETS = INSTR_OFFSETS;
var REGISTERS = two_way_lookup_table(_registers.REGISTER_LIST);
exports.REGISTERS = REGISTERS;
var OPCODES = two_way_lookup_table(_opcodes.OPCODE_LIST);
exports.OPCODES = OPCODES;

},{"./INSTRUCTION_CONSTANTS.js":1,"./opcodes":4,"./registers":5}],3:[function(require,module,exports){
"use strict";

var _constants_lookup_tables = require('./constants_lookup_tables');

console.log(_constants_lookup_tables.REGISTERS);
console.log(_constants_lookup_tables.OPCODES);

var pc = 0;
var running = true;
var stack = [];
var registers = {
  reg0: 0,
  reg1: 0,
  reg2: 0,
  reg3: 0,
  reg4: 0,
  reg5: 0,
  reg6: 0,
  reg7: 0,

  reg8: 0,
  reg9: 0,
  rega: 0,
  regb: 0,
  vm: 0,
  ih: 0,
  sp: 0,
  pc: 0
};

var halt = function halt(instr) {
  running = false;
  console.log("halting");
};

var addi = function addi(instr) {
  debugger;
  registers[instr.dest_reg] = registers[instr.src_reg_1] + registers[instr.src_reg_2];
};

var subi = function subi(instr) {
  registers[instr.dest_reg] = registers[instr.src_reg_1] - registers[instr.src_reg_2];
};

var loadl = function loadl(instr) {
  //clear low 2 bytes
  registers[instr.dest_reg] = registers[instr.dest_reg] & 0xFF00;

  //replace low 2 bytes with constant
  registers[instr.dest_reg] = registers[instr.dest_reg] | instr.constant;
};

var loadh = function loadh(instr) {
  //clear high 2 bytes
  registers[instr.dest_reg] = registers[instr.dest_reg] & 0x00FF;

  //shift constant two bytes
  instr.constant = instr.constant << 16;

  //replace high 2 bytes with constant
  registers[instr.dest_reg] = registers[instr.dest_reg] | instr.constant;
};

var instructions = {
  halt: halt,
  loadl: loadl,
  addi: addi,
  subi: subi,
  loadh: loadh
};

var fetch = function fetch() {
  var next = memory[registers.pc];
  registers.pc += 1;
  return next;
};

var decode = function decode(instr) {
  return {
    opcode: (instr & 0xFF000000) >>> _constants_lookup_tables.INSTR_OFFSETS.OPCODE,
    dest_reg: (instr & 0x00F00000) >>> _constants_lookup_tables.INSTR_OFFSETS.DEST_REG,
    src_reg_1: (instr & 0x000F0000) >>> _constants_lookup_tables.INSTR_OFFSETS.SRC_REG_1,
    src_reg_2: (instr & 0x0000F000) >>> _constants_lookup_tables.INSTR_OFFSETS.SRC_REG_2,
    constant: (instr & 0x0000FFFF) >>> _constants_lookup_tables.INSTR_OFFSETS.CONSTANT
  };
};

var evaluate = function evaluate(instr) {
  instr.opcode = _constants_lookup_tables.OPCODES[instr.opcode];
  instr.dest_reg = _constants_lookup_tables.REGISTERS[instr.dest_reg];
  instr.src_reg_1 = _constants_lookup_tables.REGISTERS[instr.src_reg_1];
  instr.src_reg_2 = _constants_lookup_tables.REGISTERS[instr.src_reg_2];

  var execution_function = instructions[instr.opcode];
  execution_function(instr);
};

var main = function main() {
  debugger;
  while (running) {
    evaluate(decode(fetch()));
  }
  debugger;
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
    var op = _constants_lookup_tables.OPCODES[opcode];
    instr = pack(instr, op, _constants_lookup_tables.INSTR_OFFSETS.OPCODE);
  }
  if (dest_reg) {
    reg = _constants_lookup_tables.REGISTERS[dest_reg];
    instr = pack(instr, reg, _constants_lookup_tables.INSTR_OFFSETS.DEST_REG);
  }
  if (src_reg_1) {
    reg = _constants_lookup_tables.REGISTERS[src_reg_1];
    instr = pack(instr, reg, _constants_lookup_tables.INSTR_OFFSETS.SRC_REG_1);
  }
  if (src_reg_2) {
    reg = _constants_lookup_tables.REGISTERS[src_reg_2];
    instr = pack(instr, reg, _constants_lookup_tables.INSTR_OFFSETS.SRC_REG_2);
  }
  if (constant) {
    instr = pack(instr, constant, _constants_lookup_tables.INSTR_OFFSETS.CONSTANT);
  }
  return instr;
};

var pack = function pack(instr, field, offset) {
  return instr | field << offset;
};

var memory = [["loadl", "reg1", null, null, 1], ["loadh", "reg1", null, null, 1], ["loadl", "reg2", null, null, 2], ["loadh", "reg2", null, null, 2], ["addi", "reg3", "reg1", "reg2", null], ["loadl", "reg0", null, null, 16], ["loadl", "reg4", null, null, 7], ["subi", "reg5", "reg0", "reg4", null], ["halt", null, null, null, null]].map(pack_instruction);

main();

console.log("packing loadl reg1 5: " + pack_instruction(["loadl", "reg1", null, null, 5]).toString(16));

},{"./constants_lookup_tables":2}],4:[function(require,module,exports){
// list of OPCODES with thier assembly name and instruction code
"use strict";

exports.__esModule = true;
var OPCODE_LIST = [

//halts the machine
["halt", 0x00],

//adds two integers
["addi", 0x01],

//subtracts two integers
["subi", 0x02],

//loads 16 bits into the least significant bytes of a register
["loadl", 0x03],

//loads 16 bits into the most significant bytes of a register
["loadh", 0x04]];
exports.OPCODE_LIST = OPCODE_LIST;

},{}],5:[function(require,module,exports){

//list of registers with their assembly name and number
"use strict";

exports.__esModule = true;
var REGISTER_LIST = [
//general purpose registers
["reg0", 0x0], ["reg1", 0x1], ["reg2", 0x2], ["reg3", 0x3], ["reg4", 0x4], ["reg5", 0x5], ["reg6", 0x6], ["reg7", 0x7], ["reg8", 0x8],

//currently undecided what to with these
["reg9", 0x9], ["rega", 0xa], ["regb", 0xb],

//video memory pointer
["vm", 0xc],

//interupt handler pointer
["ih", 0xd],

//stack pointer
["sp", 0xe],

//program counter
["pc", 0xf]];
exports.REGISTER_LIST = REGISTER_LIST;

},{}]},{},[3]);
