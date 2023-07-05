const mongoose = require("mongoose");
// const bcrypt = require("../node_modules/bcrypt")
// const jwt = require("../node_modules/jsonwebtoken")

const AdminSchema = mongoose.Schema(
  {
    company_Name: { type: String, require: true, trim: true },
    email: { type: String, require: true, validate: {
      validator: function(value) {
        // Regex pattern for email validation
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
      message: 'Invalid email address'
    } },
    password: { type: String, require: true },
    role : {type : String, require : true, default : "admin" },
  
  },
  {
    timestamps: true,
  }
);

const admin = mongoose.model("Admin", AdminSchema);

module.exports = admin
