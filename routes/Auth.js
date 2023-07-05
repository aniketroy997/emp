const express = require("express");
const router = express.Router();
const bcrypt = require("../node_modules/bcrypt");
const SuperAdmin = require("../model/SuperAdminSchema");
const SuperAdminAuthentication = require("../middleware/SuperAdminAuthentication")
const admin = require("../model/AdminSchema");
const employees = require("../model/EmployeeSchema");
const  jwt  = require("../node_modules/jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require("crypto");

const dotenv = require("dotenv");
const AdminAuthentication = require("../middleware/AdminAuthentication");
dotenv.config({path : "../config.env"})

require("../db/Connection");

router.get("/", (req, res) => {
  res.send("hkp");
});


// Get All Data 
router.get("/getAllData", async (req, res) => {

  try {
    
 
  const SuperAdmins = await SuperAdmin.find()
  const Admins = await admin.find()
  const employee = await employees.find({})

  res.status(200).json({"message": SuperAdmins, Admins, employees})
} catch (error) {
    res.status(401).json({"message" : error})
}
})

router.post("/", async (req, res) => {

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(421).json({ message: "Please complete all details" });
    } else {
      const UserExist = await SuperAdmin.findOne({ email });

      if (UserExist) {
        return res.status(422).json({ message: "User Already Exist" });
      } 

      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: err });
        }

        
        const user = new SuperAdmin({ name, email, password : hashedPassword });

        const UserSaved = await user.save();

        if (UserSaved) {
          return res.status(201).json({ message: "User Created Successfully" });
        } else {
          return res.status(500).json({ message: "Internal Server Error" });
        }
      })
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});



router.post("/superadmin/login", async (req, res) => {
  try {
  
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(422).json({ message: "please enter all fields" });
    }

    const SuperAdminExist = await SuperAdmin.findOne({ email });

    if (!SuperAdminExist) {
      return res.status(401).json({ message: 'user dont exist' });
    }
    
      const isMatch = await bcrypt.compare(password, SuperAdminExist.password);


      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

        jwt.sign({ _id: SuperAdminExist._id }, process.env.SECRET_KEY, { expiresIn: '5m' }, function(err, token){
          
          if(err){
           return res.status(401).json({message: err})
          }

          if(token){
            res.cookie("token_superAdmin", token, {httpOnly : true, secure : false, sameSite : "none",  expiresIn : 300000})
           return res.status(200).json({message : "successfully loggedIn"})
          }
        })

  } catch (error) {
    res.status(500 ).json({message : error.message})
  }
});



router.post("/superadmin/createAdmin", SuperAdminAuthentication, async (req, res) => {

   try {
     const { company_Name, email, password } = req.body;

     if (!company_Name || !email || !password) {
       return res.status(421).json({ message1: "Please complete all details" });
     }

     const adminExist = await admin.findOne({ email });e

     if (adminExist) {
       return res.status(422).json({ message2: "Admin Already Exist" });
     }

     bcrypt.hash(password, 10, async (err, hashedPassword) => {
       if (err) {
         return res.status(500).json({ message: err });
       }

       const admins = new admin({company_Name, email, password: hashedPassword, });

       const adminSaved = await admins.save();

       if (adminSaved) {
         return res.status(201).json({ message: "User Created Successfully" });
       } else {
         return res.status(500).json({ message: "Internal Server Error" });
       }
     });
   } catch (error) {
     return res.status(500).json({ message: error });
   }
});

router.get("/superadmin/logout", (req, res) => {

  const cookies = req.cookies
  if (!cookies?.token_superAdmin) return res.sendStatus(204) //No content
  res.clearCookie('token_superAdmin', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Successfully Logged Out' })
});
// token_superAdmin
router.get("/admin/logout", (req, res) => {

  const cookies = req.cookies
  if (!cookies?.token) return res.sendStatus(204) //No content
  res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Successfully Logged Out' })
});




router.post("/admin/login", async (req, res) => {

  const {email, password} = req.body
console.log(email, password);
  if(!email || !password){
   return res.status(403).json({message : "please enter email"})
  }
  
  const AdminExist = await admin.findOne({email})
  
  if(!AdminExist){
    return res.status(401).json({message : "Admin dosen't exist"})
  }

  const isMatch = await bcrypt.compare(password, AdminExist.password);

  console.log("aadm", AdminExist);


  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  

 jwt.sign({ _id: AdminExist._id }, process.env.SECRET_KEY, { expiresIn: '1h' }, function(err, token){
          
          if(err){
            return res.status(401).json({message: err})
          }

          if(token){
            res.cookie("token_admin", token, {httpOnly : true, secure : false, sameSite : "none",  expiresIn : 300000})
            return res.status(200).json({message : "successfully loggedIn"})
          }
        })



})


router.post("/admin/createemployee", AdminAuthentication, async (req, res) => {

  try {
    // res.send("hii")

    const {email} = req.body;
    
    if(!email){
      return res.status(403).json({message : "please enter email"})
    }
    
    const employeeExist = await employees.findOne({email})
    
    if(employeeExist){
      return res.status(401).json({message : "employee already exist"})
    }

    jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' }, function(err, token){
          
      if(err){
        return res.status(401).json({message: err})
      }

      if(token){
        // res.cookie("token_admin", token, {httpOnly : true, secure : false, sameSite : "none",  expiresIn : 300000})
        
        bcrypt.hash(token, 10, async (err, success) => {
          if (err) {
            return res.status(500).json({ message: err });
          }

          if(success){
            console.log("succ", success);
            return res.status(200).json({message : success})
            const link = `http://localhost:5000/api/addemp?token=${success}&email=${email}`
          }

        })



        const transporter = nodemailer.createTransport({
          host : "smtp.gmail.com",
          port : 587,
          secure : false,
          requireTLS : true,
          auth : {
            user : "hit98987@gmail.com",
            pass : "gscneqsqdnlxiegl"
          }
        });

    const mailOptions = {
      from: "hit98987@gmail.com",
      to: "hitpatel18112000@gmail.com",
      subject: 'Password Reset',
      html: `<p>Please click the following link to reset your password:</p><p>${token}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error sending email' });
      }else{

     

       console.log('Password reset email sent');
       console.log(info.response);
       res.json({ message: 'Password reset email sent' });
     }
     });
    
  }
 })
    
let Token = crypto.randomBytes(32).toString("hex");
const hash = await bcrypt.hash(Token, Number(10));
console.log(Token);
console.log(hash);
const a = await bcrypt.compare(Token, hash)
console.log(a);

} catch (error) {
     console.log(error);
    res.status(403).json({error : error});
}
});



router.post("/addemp/", async (req, res) => {

  const h = req.query;
  console.log("tk", h.token);
  console.log("em", h.email);

  const isMatch = await bcrypt.compare(h.token );
  console.log("idM", isMatch);
//     const { Firstname, Middlename, Lastname, email, password, birthDate, PermanentAddress, CorrespondingAddress, AadharNumber, PhoneNumber, PreviousCompany, EmergencyPersonName, EmergencyPersonMobileNo, EmergencyPersonAddress, EmergencyPersonBloodGroup} = req.body;


// if( !Firstname || !Middlename || !Lastname || !email || !password || !birthDate || !PermanentAddress || !CorrespondingAddress || !AadharNumber || !PhoneNumber || !PreviousCompany || !EmergencyPersonName || !EmergencyPersonMobileNo ||!EmergencyPersonAddress || !EmergencyPersonBloodGroup ){
//     res.send("please fillout all fields")
// }




//     const d = new employees({Firstname, Middlename, Lastname, email, password, birthDate : new Date(birthDate), PermanentAddress, CorrespondingAddress, AadharNumber, PhoneNumber, PreviousCompany, EmergencyPersonName, EmergencyPersonMobileNo, EmergencyPersonAddress, EmergencyPersonBloodGroup})
    
//     console.log("aa", AadharNumber);

//   const a = await d.save()
//   if (a) {
//     return res.status(201).json({ message3: "User Created Successfully" });
//   } else {
//     return res.status(500).json({ message4: "Internal Server Error" });
//   }
})

module.exports = router;











//   const { Firstname, Middlename, Lastname, email, password, birthDate, PermanentAddress, CorrespondingAddress, AadharNumber, PhoneNumber, PreviousCompany, EmergencyPersonName, EmergencyPersonMobileNo, EmergencyPersonAddress, EmergencyPersonBloodGroup} = req.body;


// if( !Firstname || !Middlename || !Lastname || !email || !password || !birthDate || !PermanentAddress || !CorrespondingAddress || !AadharNumber || !PhoneNumber || !PreviousCompany || !EmergencyPersonName || !EmergencyPersonMobileNo ||!EmergencyPersonAddress || !EmergencyPersonBloodGroup ){
//     res.send("please fillout all fields")
// }


 



//     const d = new employees({Firstname, Middlename, Lastname, email, password, birthDate : new Date(birthDate), PermanentAddress, CorrespondingAddress, AadharNumber, PhoneNumber, PreviousCompany, EmergencyPersonName, EmergencyPersonMobileNo, EmergencyPersonAddress, EmergencyPersonBloodGroup})
    
//     console.log("aa", AadharNumber);

//   const a = await d.save()
//   if (a) {
//     return res.status(201).json({ message3: "User Created Successfully" });
//   } else {
//     return res.status(500).json({ message4: "Internal Server Error" });
//   }
