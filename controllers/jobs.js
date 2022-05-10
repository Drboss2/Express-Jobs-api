
const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllJobs = async(req,res)=>{
  const jobs = await Job.find({createBy:req.user.userId}).sort('createdAt')
   res.status(StatusCodes.OK).json({jobs,count:jobs.length})
 }
 
 const getJob = async (req,res)=>{
   const {
     user:{ userId },
     params:{ id:jobId },
    } = req

   const job = await Job.findOne({
     _id:jobId,
     createBy:userId
   })
   if(!job){
     throw new NotFoundError(`No job avaliables with id ${jobId}`)
   }

   res.status(StatusCodes.OK).json({job})
 }

 const createJob = async (req,res)=>{
   req.body.createBy = req.user.userId

   const job = await Job.create(req.body)
   res.status(StatusCodes.CREATED).json({job})
 }

 const updateJob = async (req,res)=>{
    const {
      body:{company,position},
      user:{ userId },
      params:{ id:jobId },
    } = req

    if(company === "" || position === ""){
      throw new BadRequestError(`enter value`)
    }

    const job = await Job.findByIdAndUpdate({
      _id:jobId,
      createBy:userId,
    },
    req.body,
    {
      new:true,
      runValidators:true
    })
    if(!job){
      throw new NotFoundError(`No job avaliables with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(job)
 }

 const deleteJob = async (req,res)=>{
    const {
      user:{ userId },
      params:{ id:jobId },
    } = req

    const job = await Job.findByIdAndRemove({
      _id:jobId,
      createBy:userId,
    })

    if(!job){
      throw new NotFoundError(`No job avaliables with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({status:"true",data:"delete successful"})
 }

 module.exports={
   getAllJobs,
   getJob,
   createJob,
   updateJob,
   deleteJob
 }