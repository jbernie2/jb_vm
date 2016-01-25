// list of OPCODES with thier assembly name and instruction code
export const OPCODE_LIST = [

  //halts the machine
  ["halt", 0x00],

  //adds two unsigned integers
  ["addu", 0x01],

  //subtracts two unsigned integers
  ["subu", 0x02],

  //loads 16 bits into the least significant bytes of a register
  ["loadl",0x03],

  //loads 16 bits into the most significant bytes of a register
  ["loadh",0x04]
];

