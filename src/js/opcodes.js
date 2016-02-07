// list of OPCODES with thier assembly name and instruction code
export const OPCODE_LIST = [

  //halts the machine
  ["halt" , 0x00],

  //loads 16 bits into the least significant bytes of a register
  ["loadl", 0x01],

  //loads 16 bits into the most significant bytes of a register
  ["loadh", 0x02],

  //adds two unsigned integers
  ["addu" , 0x03],

  //subtracts two unsigned integers
  ["subu" , 0x04],

  //multiplies two unsigned integers
  ["mulu" , 0x05],

  //divides two unsigned integers
  ["divu" , 0x06],

  //modulus of two usigned integers
  ["modu" , 0x07],

  //checks if two numbers are equal
  ["eq"   , 0x08],

  //checks if two numbers are not equal
  ["neq"  , 0x09],

  //checks if a number is greater than another
  ["gt"   , 0x0a],

  //checks if a number is greater than or equal another
  ["gteq" , 0x0b],

  //checks if a number is less than another
  ["lt"   , 0x0c],

  //checks if a number is less than or equal to another
  ["lteq" , 0x0d],

  //jumps to an address (long jump)
  ["ljmp" , 0x0e],

  //jumps to an address based on conditional (conditioanl long jump)
  ["cljmp", 0x0f],

  //jumps to a higher memory address by an offset
  ["jmph" , 0x10],

  //jumps to a lower memory address by an offset
  ["jmpl" , 0x11],
  
  //jumps to a higher memory address by an offset based on conditional
  ["cjmph", 0x12],

  //jumps to a lower memory address by an offset based on conditional
  ["cjmpl", 0x13],

];

