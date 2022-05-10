const mongooes = require('mongoose')


const JobSchema = new mongooes.Schema({
   company:{
      type:String,
      required:[true,'Please provide company name'],
      maxlength:50
   },
   position:{
      type:String,
      required:[true,'provide position'],
      maxlength:100,
   },
   status:{
      type:String,
      enum:['interview','declined','pending'],
      default:'pending',
   },
   createBy:{
     type:mongooes.Types.ObjectId,
     ref:'User' ,
     required:[true,'Please provide user']
   }
}, { 
   timestamps:true
  }
)

module.exports = mongooes.model('Jobs',JobSchema)