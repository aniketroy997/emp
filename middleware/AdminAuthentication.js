const jwt = require("../node_modules/jsonwebtoken")

const AdminAuthentication = async (req,res, next) => {

    // const token = req.headers.authorization;
    const token = req.cookies.token_admin;

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

module.exports = AdminAuthentication;