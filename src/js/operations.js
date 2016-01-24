
export const operations = {

  halt: function(registers, instr){
    registers.halt = 1;
    console.log("halting");
  
    return registers;
  },

  //TODO: handle overflow, wrap around
  addi: function(registers, instr){
    registers[instr.dest_reg] = 
      registers[instr.src_reg_1] + registers[instr.src_reg_2];
  
    return registers;
  },

  //TODO: handle underflow eg. less than 0, wrap around
  subi: function(registers, instr){
    registers[instr.dest_reg] = 
      registers[instr.src_reg_1] - registers[instr.src_reg_2];
  
    return registers;
  },

  loadl: function(registers, instr){
    //clear low 2 bytes
    registers[instr.dest_reg] = (registers[instr.dest_reg] & 0xFF00) 
    
    //replace low 2 bytes with constant
    registers[instr.dest_reg] = 
      registers[instr.dest_reg] | instr.constant;
  
    return registers;
  },

  loadh: function(registers, instr){
    //clear high 2 bytes
    registers[instr.dest_reg] = (registers[instr.dest_reg] & 0x00FF) 

    //shift constant two bytes
    instr.constant = instr.constant << 16;
    
    //replace high 2 bytes with constant
    registers[instr.dest_reg] = 
      registers[instr.dest_reg] | instr.constant;
    
    return registers;
  }
};
