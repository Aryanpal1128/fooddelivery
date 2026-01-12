
import mongoose, { Schema } from "mongoose";

const userSchema= new mongoose.Schema({
   fullname : {

    type:String,
    require:true,
   },
   email : {
    unique:true,
    type:String,
    require:true,
   },
   password : String,   
  
    mobile : Number,
    
    role:{
        type:String,
        enum:["user","Owner","deliveryboy"],
        required:true
    },

    resetotp:{
        type:String
    },
 
    isotpverified:{
        type:Boolean,
        default:false
    },

    otpexpire:{
        type:Date
    }

})

const usermodel= mongoose.model('user',userSchema);
export default usermodel