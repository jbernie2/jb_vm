
//list of registers with their assembly name and number
export const REGISTER_LIST = [
  //general purpose registers
  ["reg0", 0x0],
  ["reg1", 0x1],
  ["reg2", 0x2],
  ["reg3", 0x3],
  ["reg4", 0x4],
  ["reg5", 0x5],
  ["reg6", 0x6],
  ["reg7", 0x7],
  ["reg8", 0x8],

  //currently undecided what to with these
  ["reg9", 0x9],
  ["rega", 0xa],
  ["regb", 0xb],

  //video memory pointer
  ["vm"  , 0xc],
  
  //interupt handler pointer
  ["ih"  , 0xd],
  
  //stack pointer
  ["sp"  , 0xe],
  
  //program counter
  ["pc"  , 0xf]
];
