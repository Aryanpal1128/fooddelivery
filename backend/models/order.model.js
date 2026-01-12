import mongoose from "mongoose";

const shopOrderitemSchema = new mongoose.Schema({

  item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
      required: true,
    },
    name:String,
   price:Number,
   quantity:Number

},{timestamps:true})



const shopOrderSchema= new mongoose.Schema({
  shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    owner:{
           type: mongoose.Schema.Types.ObjectId,
                  ref: 'user',

    },
    subtotal:Number,
    shoporderitems:[shopOrderitemSchema]



},{timestamps:true})
const orderSchema = new mongoose.Schema(
  {
 
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    paymentmethod:{
    type:String,
    enum:["cod","online"],
    required:true

    },
    address:{
     text :String,
     longitude:Number,
     latitude:Number,
    },
   totalamount:{
    type:Number,
    required:true
   },

   shoporders:[shopOrderSchema]




  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;
