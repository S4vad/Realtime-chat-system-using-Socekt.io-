import mongoose from "mongoose";

const userSchema=mongoose.Schema({
  firstName:{
    type:String
  },
    lastName:{
    type:String
  },
    email:{
    type:String,
    required:true
  },
    password:{
    type:String,
    required:true
  }
},{timestamps:true})

const User=mongoose.model('User',userSchema)

export default User;