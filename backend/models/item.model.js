import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Snacks",
        "Fruits",
        "Dairy",
        "Indian",
        "Pizza",
        "Burger",
        "Chinese",
        "Desserts",
      ],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    rating:{
      average:{
        type: Number,
        default: 0,
      },
      count:{
        type: Number,
        default: 0,
        
      },

    },
    foodtype: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      required: true,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("item", itemSchema);
export default Item;
