(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OPCODES = exports.REGISTERS = exports.INSTR_OFFSETS = undefined;

var _instruction_constants = require('./instruction_constants.js');

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

var INSTR_OFFSETS = exports.INSTR_OFFSETS = _instruction_constants.OFFSET_LIST;
var REGISTERS = exports.REGISTERS = two_way_lookup_table(_registers.REGISTER_LIST);
var OPCODES = exports.OPCODES = two_way_lookup_table(_opcodes.OPCODE_LIST);

},{"./instruction_constants.js":2,"./opcodes":4,"./registers":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
var OFFSET_LIST = exports.OFFSET_LIST = {
  OPCODE: 24,
  DEST_REG: 20,
  SRC_REG_1: 16,
  SRC_REG_2: 12,
  CONSTANT: 0
};

},{}],3:[function(require,module,exports){
'use strict';

var _constants_lookup_tables = require('./constants_lookup_tables');

var _operations = require('./operations.js');

var _state = require('./state.js');

var running = function running() {
  return _state.state.registers.halt == 0;
};

var fetch = function fetch() {
  var next = _state.state.memory[_state.state.registers.pc];
  _state.state.registers.pc += 1;
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

  var execution_function = _operations.operations[instr.opcode];
  execution_function(_state.state.registers, instr);
};

var main = function main() {
  while (running()) {
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

_state.state.memory = [
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
["loadl", "reg0", null, null, 7], ["loadl", "reg1", null, null, 7], ["eq", "reg2", "reg0", "reg1", null], ["halt", null, null, null, null]].map(pack_instruction);

main();

console.log("packing loadl reg1 5: " + pack_instruction(["loadl", "reg1", null, null, 5]).toString(16));

},{"./constants_lookup_tables":1,"./operations.js":5,"./state.js":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// list of OPCODES with thier assembly name and instruction code
var OPCODE_LIST = exports.OPCODE_LIST = [

//halts the machine
["halt", 0x00],

//loads 16 bits into the least significant bytes of a register
["loadl", 0x01],

//loads 16 bits into the most significant bytes of a register
["loadh", 0x02],

//adds two unsigned integers
["addu", 0x03],

//subtracts two unsigned integers
["subu", 0x04],

//multiplies two unsigned integers
["mulu", 0x05],

//divides two unsigned integers
["divu", 0x06],

//modulus of two usigned integers
["modu", 0x07],

//checks if two numbers are equal
["eq", 0x08],

//checks if two numbers are not equal
["neq", 0x09],

//checks if a number is greater than another
["gt", 0x0a],

//checks if a number is greater than or equal another
["gteq", 0x0b],

//checks if a number is less than another
["lt", 0x0c],

//checks if a number is less than or equal to another
["lteq", 0x0d],

//jumps to an address (long jump)
["ljmp", 0x0e],

//jumps to an address based on conditional (conditioanl long jump)
["cljmp", 0x0f],

//jumps to a higher memory address by an offset
["jmph", 0x10],

//jumps to a lower memory address by an offset
["jmpl", 0x11],

//jumps to a higher memory address by an offset based on conditional
["cjmph", 0x12],

//jumps to a lower memory address by an offset based on conditional
["cjmpl", 0x13]];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MAX_UNSIGNED_INT = 0xFFFFFFFF;
var MAX_SIGNED_INT = 0x7FFFFFFF;
var HIGH_BYTES_CLEAR = 0x0000FFFF;
var LOW_BYTES_CLEAR = 0xFFFF0000;

var unsigned_cast = function unsigned_cast(x) {
  return x >>> 0;
};

var numeric_boolean = function numeric_boolean(a) {
  return a ? 1 : 0;
};

var operations = exports.operations = {

  halt: function halt(registers, instr) {
    registers.halt = 1;
    console.log("halting");

    return registers;
  },

  loadl: function loadl(registers, instr) {
    //clear low 2 bytes
    registers[instr.dest_reg] = registers[instr.dest_reg] & LOW_BYTES_CLEAR;

    //replace low 2 bytes with constant
    registers[instr.dest_reg] = registers[instr.dest_reg] | instr.constant;

    return registers;
  },

  loadh: function loadh(registers, instr) {
    //clear high 2 bytes
    registers[instr.dest_reg] = registers[instr.dest_reg] & HIGH_BYTES_CLEAR;

    //shift constant two bytes
    instr.constant = unsigned_cast(instr.constant << 16);

    //replace high 2 bytes with constant
    registers[instr.dest_reg] = unsigned_cast(registers[instr.dest_reg] | instr.constant);

    return registers;
  },

  addu: function addu(registers, instr) {
    registers[instr.dest_reg] = registers[instr.src_reg_1] + registers[instr.src_reg_2];
    // handle overflow, wrap around
    if (registers[instr.dest_reg] > MAX_UNSIGNED_INT) {
      registers[instr.dest_reg] = registers[instr.dest_reg] - MAX_UNSIGNED_INT;
    }
    return registers;
  },

  subu: function subu(registers, instr) {
    registers[instr.dest_reg] = registers[instr.src_reg_1] - registers[instr.src_reg_2];
    // handle underflow, wrap around
    if (registers[instr.dest_reg] < 0) {
      registers[instr.dest_reg] = MAX_UNSIGNED_INT + registers[instr.dest_reg];
    }

    return registers;
  },

  eq: function eq(registers, instr) {
    registers[instr.dest_reg] = numeric_boolean(registers[instr.src_reg_1] === registers[instr.src_reg_2]);

    return registers;
  },

  neq: function neq(registers, instr) {
    registers[instr.dest_reg] = numeric_boolean(registers[instr.src_reg_1] !== registers[instr.src_reg_2]);

    return registers;
  },

  gt: function gt(registers, instr) {
    registers[instr.dest_reg] = numeric_boolean(registers[instr.src_reg_1] > registers[instr.src_reg_2]);

    return registers;
  },

  gteq: function gteq(registers, instr) {
    registers[instr.dest_reg] = numeric_boolean(registers[instr.src_reg_1] >= registers[instr.src_reg_2]);

    return registers;
  },

  lt: function lt(registers, instr) {
    registers[instr.dest_reg] = numeric_boolean(registers[instr.src_reg_1] < registers[instr.src_reg_2]);

    return registers;
  },

  lteq: function lteq(registers, instr) {
    registers[instr.dest_reg] = numeric_boolean(registers[instr.src_reg_1] <= registers[instr.src_reg_2]);

    return registers;
  }
};

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

//list of registers with their assembly name and number
var REGISTER_LIST = exports.REGISTER_LIST = [
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

//registers that can only be accessed using special instructions
var RESTRICTED_REGISTER_LIST = exports.RESTRICTED_REGISTER_LIST = [
//stops the machine
["halt", "n/a"]];

var ALL_REGISTERS_LIST = exports.ALL_REGISTERS_LIST = REGISTER_LIST.concat(RESTRICTED_REGISTER_LIST);

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = undefined;

var _registers = require('./registers.js');

var initialize_registers = function initialize_registers() {
  var registers = {};
  for (var i = 0; i < _registers.ALL_REGISTERS_LIST.length; i++) {
    var reg_name = _registers.ALL_REGISTERS_LIST[i][0];
    registers[reg_name] = 0;
  }

  return registers;
};

var state = exports.state = {
  registers: initialize_registers(),
  memory: []
};

},{"./registers.js":6}]},{},[3]);
