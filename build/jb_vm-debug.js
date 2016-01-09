/**
 * jb_vm 0.0.1 built on 2016-01-08.
 * Copyright (c) 2015 John Bernier <john.b.bernier@gmail.com>
 *
 * https://github.com/jbernie2/vm_js
 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OPCODE_LOOKUP = exports.REGISTER_LOOKUP = undefined;

var _registers = require('./registers');

var _registers2 = _interopRequireDefault(_registers);

var _opcodes = require('./opcodes');

var _opcodes2 = _interopRequireDefault(_opcodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var two_way_lookup_table = function two_way_lookup_table(values) {
  var lookup = {};
  values.forEach(function (a) {
    lookup[a[0]] = a[1];
    lookup[a[1]] = a[0];
  });
  return lookup;
};

var REGISTER_LOOKUP = exports.REGISTER_LOOKUP = two_way_lookup_table(_registers2.default);
var OPCODE_LOOKUP = exports.OPCODE_LOOKUP = two_way_lookup_table(_opcodes2.default);

},{"./opcodes":3,"./registers":4}],2:[function(require,module,exports){
"use strict";

var _constants_lookup_tables = require("./constants_lookup_tables");

var _constants_lookup_tables2 = _interopRequireDefault(_constants_lookup_tables);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//console.log(REGISTER_LOOKUP[0x0]);
//console.log(REGISTER_LOOKUP["reg0"]);

var OPCODE_OFFSET = 24;
var DEST_REG_OFFSET = 20;
var SRC_REG_1_OFFSET = 16;
var SRC_REG_2_OFFSET = 12;
var CONSTANT_OFFSET = 0;

//look up OPCODE names by value
var OPCODE_NAMES = ["halt", // 0x00 //
"add", // 0x01 //
"loadl" // 0x02 //
];

//look up OPCODE values by name
var OPCODE_VALUES = {
  halt: 0x00,
  add: 0x01,
  loadl: 0x02
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

var loadl = function loadl(instr) {
  console.log("loadl");
};

var instructions = {
  halt: halt,
  loadl: loadl,
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

var memory = [["loadl", "reg1", null, null, 1], ["loadl", "reg2", null, null, 2], ["add", "reg3", "reg1", "reg2", null], ["halt", null, null, null, null]].map(pack_instruction);

main();

console.log("packing loadl reg1 5: " + pack_instruction(["loadl", "reg1", null, null, 5]).toString(16));

},{"./constants_lookup_tables":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// list of OPCODES with thier assembly name and instruction code
var OPCODES = exports.OPCODES = [

//halts the machine
["halt", 0x00],

//adds two integers
["addi", 0x01],

//loads 16 bits into the least significant bytes of a register
["loadl", 0x02]];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

//list of registers with their assembly name and number
var REGISTERS = exports.REGISTERS = [

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

},{}]},{},[1,2,3,4]);
