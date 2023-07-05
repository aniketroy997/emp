const mongoose = require("mongoose");

const EmployeeTokenSchema = new mongoose.Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "employees",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,// this is the expiry time in seconds
  },
});
const EmployeeToken = mongoose.model("Token", EmployeeTokenSchema);
module.exports = EmployeeToken;