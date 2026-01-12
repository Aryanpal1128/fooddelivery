import mongoose from "mongoose";
import Shop from "../models/shop.model.js";
import uploadcloudinaryImage from "../utils/uploadcloudinaryImage.js";

export const createShop = async (req, res) => {
  
  try {
    

    const { shopname, city, state, address } = req.body;

    if (!shopname || !city || !state || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let image;
    if (req.file) {
      image = await uploadcloudinaryImage(req.file.path);
    }

    let shop = await Shop.findOne({
      $or: [
        { owner: req.userId },
        { owner: new mongoose.Types.ObjectId(req.userId) },
      ],
    });

    if (!shop) {
      shop = await Shop.create({
        name: shopname,
        city,
        state,
        address,
        image,
        owner: new mongoose.Types.ObjectId(req.userId),
      });
    } else {
      const updateData = { name: shopname, city, state, address };
      if (image) updateData.image = image;

      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    await shop.populate("owner");
    console.log("Shop saved:", shop);

    return res.status(201).json(shop);
  } catch (error) {
    console.error("Error creating/updating shop:", error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const getmyShop = async (req, res) => {
  try {
    console.log("🔍 Getting shop for user:", req.userId);

    const shop = await Shop.findOne({
      $or: [
        { owner: req.userId },
        { owner: new mongoose.Types.ObjectId(req.userId) },
      ],
    }).populate("owner").populate({
    path:'items',
    options:{sort:{updatedAt:-1}}});

    if (!shop) {
      console.log("No shop found for this user");
      return res.status(200).json(null);
    }

    console.log("Shop found:", shop.name);
    return res.status(200).json(shop);
  } catch (error) {
    console.error(" Get my shop error:", error);
    return res
      .status(500)
      .json({ message: `Get my shop error: ${error.message}` });
  }
};


export const getshopbycity = async (req, res) => {
  try {
    const { city } = req.params;
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "shop not found" });
    }

    return res.status(200).json(shops);
  } catch (error) {
    console.error("Get shops by city error:", error);
    return res
      .status(500)
      .json({ message: `Get shops by city error: ${error.message}` });
  }
};
