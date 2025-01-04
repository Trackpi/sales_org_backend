const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminmodel');
const { response } = require('express');

// Secret key for JWT signing and verification
const secretKey = process.env.JWT_KEY // Use your secret key here

// JWT verification middleware
const verifyJwt=(req, res, next) =>{
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    
    // Verify the token and decode it
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // Extract the JWT ID (jti) from the decoded token
    const jwtId = decodedToken._id;

    // console.log(decodedToken)

    if (jwtId) {
      adminModel.findOne({_id:jwtId})
      .then(response=>{
        if(response.isActive)
        {
          console.log(`JWT ID (jti): ${jwtId}`);
          req.jwtId = jwtId; // Attach JWT ID to the request object
          req.user = decodedToken;  // Optionally attach the entire decoded token (e.g., user info) to req.user
          next();  // Proceed to the next middleware or route handler
        }
        else{
          res.status(406).json({err:'your account is deactivated . Cant perform any Activity'})
        }
      })
      .catch(err=>{
        res.status(406).json({err:'error to verify jwt'})
      })
      
    } else {
      return res.status(400).json({ message: 'JWT ID (jti) is missing in the token' });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(402).json({ message: 'Token has expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = verifyJwt;
