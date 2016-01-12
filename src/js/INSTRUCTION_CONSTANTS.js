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
export const OFFSET_LIST = {
  OPCODE   : 24,
  DEST_REG : 20,
  SRC_REG_1: 16,
  SRC_REG_2: 12, 
  CONSTANT :  0
};
