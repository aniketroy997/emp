const mongoose = require("mongoose");
const bcrypt = require("../node_modules/bcrypt")
const jwt = require("../node_modules/jsonwebtoken")


const SuperAdminSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true, validate: {
      validator: function(value) {
        // Regex pattern for email validation
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
      message: 'Invalid email address'
    } },
    password: { type: String, require: true },
    role : {type : String, require : true, default : "superadmin" },
  
  },
  {
    timestamps: true,
  }
);



// SuperAdminSchema.pre('save', async function(next){

//   if(this.isModified('password')){
//       this.password = await bcrypt.hash(this.password, 12)
//   }
//   next();
// })


// // GENERATING TOKEN  
// SuperAdminSchema.methods.generateAuthToken = async function(){
//   try {
//       let token = jwt.sign({_id : this._id}, process.env.SECRET_KEY);
//       this.tokens = this.tokens.concat({token : token});
//       await this.save();
//       return token;
//   } catch (error) {
//       console.log(error)
//   }
// }


const SuperAdmin = mongoose.model("SuperAdmin", SuperAdminSchema);

module.exports = SuperAdmin;
