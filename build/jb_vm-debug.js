"use strict";

var OPCODE_OFFSET = 24;
var DEST_REG_OFFSET = 20;
var SRC_REG_1_OFFSET = 16;
var SRC_REG_2_OFFSET = 12;
var CONSTANT_OFFSET = 0;

var OPCODES = {
  halt: 0x00,
  loadi: 0x01,
  add: 0x02
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
  pc: 15
};

var halt = function halt() {
  running = false;
  console.log("halting");
  return undefined;
};

var loadi = function loadi() {
  return function (register) {
    return function (integer) {
      registers[register] = integer;
      console.log(register + " = " + registers[register]);
      return undefined;
    };
  };
};

var add = function add() {
  return function (result_reg) {
    return function (addend_reg1) {
      return function (addend_reg2) {
        registers[result_reg] = registers[addend_reg1] + registers[addend_reg2];
        console.log(result_reg + " = " + addend_reg1 + " + " + addend_reg2);
        console.log(registers[result_reg] + " = " + registers[addend_reg1] + " + " + registers[addend_reg2]);
        return undefined;
      };
    };
  };
};

var sub = function sub() {
  return function (result_reg) {
    return function (addend_reg1) {
      return function (addend_reg2) {
        registers[result_reg] = registers[addend_reg1] - registers[addend_reg2];
        console.log(result_reg + " = " + addend_reg1 + " - " + addend_reg2);
        console.log(registers[result_reg] + " = " + registers[addend_reg1] + " - " + registers[addend_reg2]);
        return undefined;
      };
    };
  };
};

var mul = function mul() {
  return function (result_reg) {
    return function (addend_reg1) {
      return function (addend_reg2) {
        registers[result_reg] = registers[addend_reg1] * registers[addend_reg2];
        console.log(result_reg + " = " + addend_reg1 + " * " + addend_reg2);
        console.log(registers[result_reg] + " = " + registers[addend_reg1] + " * " + registers[addend_reg2]);
        return undefined;
      };
    };
  };
};

var div = function div() {
  return function (result_reg) {
    return function (addend_reg1) {
      return function (addend_reg2) {
        registers[result_reg] = registers[addend_reg1] / registers[addend_reg2];
        console.log(result_reg + " = " + addend_reg1 + " / " + addend_reg2);
        console.log(registers[result_reg] + " = " + registers[addend_reg1] + " / " + registers[addend_reg2]);
        return undefined;
      };
    };
  };
};

var instructions = {
  halt: halt,
  loadi: loadi,
  add: add,
  sub: sub,
  mul: mul,
  div: div
};

var fetch = function fetch() {
  var next = prog[pc];
  pc += 1;
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

var evaluate = (function () {
  var partially_applied_instruction;
  return function (arg) {
    if (partially_applied_instruction !== undefined) {
      partially_applied_instruction = partially_applied_instruction(arg);
      if (typeof partially_applied_instruction !== "function") {
        partially_applied_instruction = undefined;
      }
    } else {
      partially_applied_instruction = instructions[arg]();
    }
  };
})();

var main = function main() {
  while (running) {
    evaluate(fetch());
  }
};

var pack_instruction = function pack_instruction(opcode, dest_reg, src_reg_1, src_reg_2, constant) {
  var instr;
  var reg;
  if (opcode) {
    var op = OPCODES[opcode];
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

var prog = ["loadi", "reg1", 1, "loadi", "reg2", 2, "add", "reg3", "reg1", "reg2", "halt"];

main();

console.log("packing loadi reg1 5: " + pack_instruction("loadi", "reg1", null, null, 5).toString(16));
//# sourceMappingURL=jb_vm-debug.js.map
