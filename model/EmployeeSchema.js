const mongoose = require("mongoose");


// function validateAadhaarNumber(aadhaarNumber) {
//     // Remove any whitespace or special characters from the Aadhaar number
//     const sanitizedNumber = aadhaarNumber.replace(/\s/g, '');
  
//     // Aadhaar number should be exactly 12 digits
//     if (!/^\d{12}$/.test(sanitizedNumber)) {
//       return false;
//     }
  
//     // Validate the checksum digit
//     const digits = sanitizedNumber.split('').map(Number);
//     const checkSum = digits[11];
//     let sum = 0;
    
//     for (let i = 0; i < 11; i++) {
//       sum += digits[i] * (11 - i);
//     }
    
//     const remainder = (sum % 11) % 10;
//     if (remainder !== checkSum) {
//       return false;
//     }
    
//     return true;
//   }

const EmployeeSchema = new mongoose.Schema({
 
  Firstname : {type : String, require : true},
  Middlename : {type : String, require : true},
  Lastname : {type : String, require : true},
  email: {type : String, require : true, validate: {
    validator: function(value) {
      return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
    },
    message: 'Invalid email address'
  }},
  password: {type : String, require : true},
  birthDate: {type : Date, require : true, max : Date.now},
  PermanentAddress : {type : String, require : true},
  CorrespondingAddress : {type : String, require : true},
  AadharNumber : {type : String, require : true, validate: { validator: function(value) { return /^[0-9]{12}$/.test(value); },
    message: 'Aadhaar number must be a 12-digit number'
  }},

  PhoneNumber : {type : String, require : true, validate: { validator: function(value) { return /^[0-9]{10}$/.test(value);}, message: 'Phone number must be a 10-digit numbers'
  }},
  PreviousCompany : {type : String, require : true},


  DateOfJoining: {
    type: Date,
    default: Date.now,
    require : true
  },


    EmergencyPersonName : {type : String, require : true},
    EmergencyPersonMobileNo : {type : String, require : true, validate: { validator: function(value) { return /^[0-9]{10}$/.test(value);}, message : 'Phone number must be a 10-digit numbers'
  }},
    EmergencyPersonAddress : {type : String, require : true},
    EmergencyPersonBloodGroup : {type : String, require : true},
},
{
  timestamps: true,
});
const employees = mongoose.model("Employee", EmployeeSchema);

module.exports = employees

