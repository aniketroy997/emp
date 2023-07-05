const mongoose = require("mongoose")

mongoose.connect(process.env.CONNECTION_STRING).then(() => console.log("db connected")).catch(err => console.log(err));
