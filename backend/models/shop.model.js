
import mongoose, { Schema } from "mongoose";

const shopSchema= new mongoose.Schema({
   name :{
    type :String,
    required:true,
   },
   image:{
    type :String,
    // required:true,
   },
    city : {
        type :String,
    required:true,
    },
    state : {
        type :String,
    required:true,
    },
    address : {
        type :String,
    required:true,
    },
    owner :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true,
    },
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item',
    }]


},{timestamps:true})

const Shop= mongoose.model('shop',shopSchema);
export default Shop