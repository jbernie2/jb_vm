const MAX_UNSIGNED_INT  = 0xFFFFFFFF;
const MAX_SIGNED_INT    = 0x7FFFFFFF;
const HIGH_BYTES_CLEAR  = 0x0000FFFF;
const LOW_BYTES_CLEAR   = 0xFFFF0000;

const unsigned_cast = function(x){
  return x >>> 0;
};

export const operations = {

  halt: function(registers, instr){
    registers.halt = 1;
    console.log("halting");
  
    return registers;
  },

  addu: function(registers, instr){
    registers[instr.dest_reg] = 
      registers[instr.src_reg_1] + registers[instr.src_reg_2];
    // handle overflow, wrap around
    if(registers[instr.dest_reg] > MAX_UNSIGNED_INT){
      registers[instr.dest_reg] = registers[instr.dest_reg] - MAX_UNSIGNED_INT;
    }
    return registers;
  },

  subu: function(registers, instr){
    registers[instr.dest_reg] = 
      registers[instr.src_reg_1] - registers[instr.src_reg_2];
    // handle underflow, wrap around
    if(registers[instr.dest_reg] < 0){
      registers[instr.dest_reg] = MAX_UNSIGNED_INT + registers[instr.dest_reg];
    }

    return registers;
  },

  loadl: function(registers, instr){
    //clear low 2 bytes
    registers[instr.dest_reg] = (registers[instr.dest_reg] & LOW_BYTES_CLEAR) 
    
    //replace low 2 bytes with constant
    registers[instr.dest_reg] = 
      registers[instr.dest_reg] | instr.constant;
  
    return registers;
  },

  loadh: function(registers, instr){
    //clear high 2 bytes
    registers[instr.dest_reg] = (registers[instr.dest_reg] & HIGH_BYTES_CLEAR) 

    //shift constant two bytes
    instr.constant = unsigned_cast(instr.constant << 16);
    
    //replace high 2 bytes with constant
    registers[instr.dest_reg] = 
      unsigned_cast(registers[instr.dest_reg] | instr.constant);
    
    return registers;
  }
};
