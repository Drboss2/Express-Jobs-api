
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,UnauthenticatedError} = require('../errors')


const register = async (req,res)=>{
  const {name,email,password}  = req.body

  if(!name || !email || !password){
      throw new BadRequestError('Please enter value')
  }

  const user = await User.create({...req.body})
  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({user:{ name:user.name},token})
}

const login = async (req,res)=>{
   const {email,password} = req.body

    if(!email || !password){
      throw new BadRequestError('Please enter value')
    }
    const user = await User.findOne({email})

    if(!user){
      throw new UnauthenticatedError('User does not exist')
    }

    const isPasswordMatch = await user.comparePassword(password)
    if(!isPasswordMatch){
      throw new UnauthenticatedError('Password incorrect')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name,email:user.email},token})

}

 module.exports={
   register,
   login
 }