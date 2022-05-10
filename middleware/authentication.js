const User = require("../models/User")
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const authMiddleware = (req,res, next)=>{
  const authHeader = req.headers.authorization
    
    if(!authHeader){
       throw new UnauthenticatedError("Authentication invalid")
    }
    const token = authHeader.split(' ')[1]

    try{
      const payload = jwt.verify(token,process.env.JWT_SECRET)
      req.user = {userId:payload.userId,name:payload.name}
      next()
    }catch(err){
      throw new UnauthenticatedError("Authentication invalid")

    }
}


module.exports = authMiddleware