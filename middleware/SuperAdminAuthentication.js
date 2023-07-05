const jwt = require("jsonwebtoken")
// const SuperAdmin = require("../../model/SuperAdminSchema")

// const Authenticate = async (req,res, next) => {
//     try {
//         // const token = req.cookies.jwt_token;
//       const token = req.cookies.jwt_token;
//         console.log("Authenticate token : ", token)
//         const verifyToken =  jwt.verify(token, process.env.SECRET_KEY);
//         console.log('Verified token : ', verifyToken);

//         const rootUser = await SuperAdmin.findOne({_id: verifyToken._id, "tokens.token": token});
//         // if()
// // console.log('ITS ROOT USER', rootUser);
//         if(!rootUser){
//             // throw new Error('User not found')
//             return res.send("user nf")
       
//         }
//             else if(rootUser){
//                 console.log(" User verified Successfully")}
        

//         req.token = token;
//         req.rootUser = rootUser;
//         req.UserId = rootUser._id
//         next();


//     } catch (error) {
//         // console.log(error);
//         res.status(401).send({Error : "Unauthorized - No token provided"})
//     }
// } 


const SuperAdminAuthentication = async (req,res, next) => {

    // const token = req.headers.authorization;
    const token = req.cookies.token_superAdmin;

    if (!token) {
        return res.status(401).json({ message: 'Authorization required' });
      }

    try {
   
        jwt.verify(token, process.env.SECRET_KEY), (err, decoded ) => {
            if (err) {
              return res.status(401).json({ error: 'Invalid token' });
            }
            
            if (decoded ) {
              req._id = decoded._id;
            }
     
          };

          next();

    } catch (error) {
        res.status(401).json({message : error.message})
    }
} 

module.exports = SuperAdminAuthentication;