import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadcloudinaryImage from "../utils/uploadcloudinaryImage.js";


export const itemcontrol = async (req, res) => {
  try {
   

    const { name, category, foodtype, price } = req.body;

   
    if (!name || !category || !foodtype || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }

    let image = "";
    if (req.file) {
      image = await uploadcloudinaryImage(req.file.path);
    }

    const newItem = await Item.create({
      name,
      
      category,
      foodtype,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(newItem._id);
    await shop.save();
   await shop.populate([
  { path: "owner" },
  { path: "items", options: { sort: { updatedAt: -1 } } },
]);

    console.log("Item created:", newItem.name);
    return res.status(201).json(newItem);
  } catch (error) {
    console.error("Add item error:", error);
    return res
      .status(500)
      .json({ message: `Add item error: ${error.message}` });
  }
};


export const edititem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, foodtype, price } = req.body;

    
    let image;
    if (req.file) {
      image = await uploadcloudinaryImage(req.file.path);
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { name, category, foodtype, price, image },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
   const shop = await Shop.findOne({owner:req.userId}).populate({
    path:'items',
    options:{sort:{updatedAt:-1}}

   })
    
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error(" Edit item error:", error);
    return res
      .status(500)
      .json({ message: `Edit item error: ${error.message}` });
  }
};

export const getitembyid = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);

    if (item) {
      return res.status(200).json(item);
    }

    return res.status(404).json({ message: "Item not found" });
  } catch (error) {
    console.error("Get item error:", error);
    return res.status(500).json({ message: `Get item error: ${error.message}` });
  }
}

export const  deleteitem = async (req,res)=>{
  try {
    const itemId = req.params.itemId;
    if(!itemId){
      return res.status(404).json({ message: "Item id required" });
    }
    const item = await Item.findByIdAndDelete(itemId) 
     if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }   

    const shop = await Shop.findOne({owner:req.userId})
    shop.items= shop.items.filter(i=>i.toString!==itemId)
    await shop.save();
    await shop.populate({
    path:'items',
    options:{sort:{updatedAt:-1}}})
      return res.status(200).json({ message: shop });
  } catch (error) {
     console.error("delete item error:", error);
    return res.status(500).json({ message: `delete item error: ${error.message}` });
  }
}

export const getitembycity = async (req, res) => {
  try {
    const { city } = req.params;
    if(!city){
    return res.status(404).json({ message: "city not found" });
}
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate({
    path:'items',
    options:{sort:{updatedAt:-1}}});
  

    const shopid = await shops.map((shop)=>shop._id)

    const items = await Item.find({shop:{$in:shopid}})
    

    return res.status(200).json(items);
  } catch (error) {
    console.error("Get items by city error:", error);
    return res
      .status(500)
      .json({ message: `Get items by city error: ${error.message}` });
  }
};