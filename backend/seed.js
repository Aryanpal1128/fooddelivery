import "dotenv/config";
import mongoose from "mongoose";
import usermodel from "./models/usermodel.js";
import Shop from "./models/shop.model.js";
import Item from "./models/item.model.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

// Delete old seeded data
const owner = await usermodel.findOne({ email: "dummyowner@food.com" });
if (owner) {
  const oldShops = await Shop.find({ owner: owner._id });
  for (const s of oldShops) await Item.deleteMany({ shop: s._id });
  await Shop.deleteMany({ owner: owner._id });
  await usermodel.deleteOne({ _id: owner._id });
  console.log("🗑️  Deleted old seed data");
}

const newOwner = await usermodel.create({
  fullname: "Dummy Owner", email: "dummyowner@food.com", password: "dummy123", role: "Owner",
});

const u = (id) => `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`;

const shops = [
  { name: "Delhi Darbar", city: "Greater Noida", state: "Uttar Pradesh", address: "Near Pari Chowk, Alpha 1, Greater Noida",
    img: u("1517248135467-4c7edcad34c4") },
  { name: "Mumbai Tiffins", city: "Greater Noida", state: "Uttar Pradesh", address: "Pari Chowk Main Road, Greater Noida",
    img: u("1555396273-367ea4eb4db5") },
  { name: "Spice Garden", city: "Greater Noida", state: "Uttar Pradesh", address: "Opposite Ansal Plaza, Pari Chowk, Greater Noida",
    img: u("1466978913421-dad2ebd01d17") },
  { name: "Royal Tandoor", city: "Greater Noida", state: "Uttar Pradesh", address: "Knowledge Park 2, Near Pari Chowk, Greater Noida",
    img: u("1552566626-52f8b828add9") },
  { name: "Kolkata Bites", city: "Greater Noida", state: "Uttar Pradesh", address: "Gamma 1 Market, Near Pari Chowk, Greater Noida",
    img: u("1414235077428-338989a2e8c0") },
];

const itemsByShop = [
  // Delhi Darbar
  [
    { name: "Butter Chicken", price: 280, category: "Indian", foodtype: "Non-Veg", rating: { average: 4.5, count: 120 }, img: u("1603894584373-5ac82b2ae398") },
    { name: "Chole Bhature", price: 120, category: "Indian", foodtype: "Veg", rating: { average: 4.3, count: 95 }, img: u("1626132647523-66c0bba88f4e") },
    { name: "Paneer Tikka", price: 220, category: "Indian", foodtype: "Veg", rating: { average: 4.2, count: 80 }, img: u("1599487488170-d11ec9c172f0") },
    { name: "Mutton Biryani", price: 320, category: "Indian", foodtype: "Non-Veg", rating: { average: 4.7, count: 150 }, img: u("1563379091339-03b21ab4a4f4") },
    { name: "Aloo Paratha", price: 80, category: "Indian", foodtype: "Veg", rating: { average: 4.0, count: 60 }, img: u("1565557623262-b51c2513a641") },
    { name: "Chicken Seekh Kebab", price: 200, category: "Indian", foodtype: "Non-Veg", rating: { average: 4.4, count: 88 }, img: u("1610057099443-fde6c99db9e1") },
    { name: "Gulab Jamun", price: 60, category: "Desserts", foodtype: "Veg", rating: { average: 4.6, count: 110 }, img: u("1666190053310-0a1eaa67d4e5") },
    { name: "Lassi", price: 50, category: "Dairy", foodtype: "Veg", rating: { average: 4.1, count: 70 }, img: u("1587049352851-8d4e89133924") },
  ],
  // Mumbai Tiffins
  [
    { name: "Vada Pav", price: 30, category: "Snacks", foodtype: "Veg", rating: { average: 4.8, count: 200 }, img: u("1606491956689-2ea866880049") },
    { name: "Pav Bhaji", price: 120, category: "Indian", foodtype: "Veg", rating: { average: 4.5, count: 160 }, img: u("1645177628172-a94c1f96e6db") },
    { name: "Misal Pav", price: 90, category: "Indian", foodtype: "Veg", rating: { average: 4.3, count: 85 }, img: u("1567337710282-00832b415979") },
    { name: "Bombay Sandwich", price: 70, category: "Snacks", foodtype: "Veg", rating: { average: 4.0, count: 55 }, img: u("1528735602780-2552fd46c7af") },
    { name: "Chicken Frankie", price: 110, category: "Snacks", foodtype: "Non-Veg", rating: { average: 4.2, count: 90 }, img: u("1626700051175-6818013e1d4f") },
    { name: "Bhel Puri", price: 50, category: "Snacks", foodtype: "Veg", rating: { average: 4.4, count: 130 }, img: u("1601050690597-df0568f70950") },
    { name: "Cutting Chai", price: 15, category: "Dairy", foodtype: "Veg", rating: { average: 4.6, count: 180 }, img: u("1571934811356-5cc061b6211f") },
    { name: "Mango Mastani", price: 100, category: "Desserts", foodtype: "Veg", rating: { average: 4.5, count: 95 }, img: u("1546173159-315724a31696") },
  ],
  // Spice Garden
  [
    { name: "Masala Dosa", price: 90, category: "Indian", foodtype: "Veg", rating: { average: 4.7, count: 170 }, img: u("1630383249896-424e482df921") },
    { name: "Chicken Fried Rice", price: 180, category: "Chinese", foodtype: "Non-Veg", rating: { average: 4.1, count: 75 }, img: u("1603133872878-684f208fb84b") },
    { name: "Paneer Butter Masala", price: 200, category: "Indian", foodtype: "Veg", rating: { average: 4.3, count: 90 }, img: u("1631452180519-c014fe946bc7") },
    { name: "Veg Hakka Noodles", price: 150, category: "Chinese", foodtype: "Veg", rating: { average: 4.0, count: 65 }, img: u("1569718212165-3a8278d5f624") },
    { name: "Filter Coffee", price: 40, category: "Dairy", foodtype: "Veg", rating: { average: 4.8, count: 200 }, img: u("1509042239860-f550ce710b93") },
    { name: "Idli Sambar", price: 60, category: "Indian", foodtype: "Veg", rating: { average: 4.5, count: 140 }, img: u("1589301760435-2c60c7856d76") },
    { name: "Gobi Manchurian", price: 160, category: "Chinese", foodtype: "Veg", rating: { average: 4.2, count: 80 }, img: u("1625220194771-7ebdea0b70b9") },
    { name: "Rava Kesari", price: 70, category: "Desserts", foodtype: "Veg", rating: { average: 4.4, count: 60 }, img: u("1551024506-0bccd828d307") },
  ],
  // Royal Tandoor
  [
    { name: "Dal Baati Churma", price: 180, category: "Indian", foodtype: "Veg", rating: { average: 4.6, count: 100 }, img: u("1585937421612-70a008356fbe") },
    { name: "Laal Maas", price: 350, category: "Indian", foodtype: "Non-Veg", rating: { average: 4.8, count: 130 }, img: u("1574484284002-952d92456975") },
    { name: "Tandoori Chicken", price: 300, category: "Indian", foodtype: "Non-Veg", rating: { average: 4.5, count: 110 }, img: u("1610057099443-fde6c99db9e1") },
    { name: "Ker Sangri", price: 150, category: "Indian", foodtype: "Veg", rating: { average: 4.1, count: 45 }, img: u("1543339308-16a7e57c29e5") },
    { name: "Pyaaz Kachori", price: 40, category: "Snacks", foodtype: "Veg", rating: { average: 4.7, count: 160 }, img: u("1601050690597-df0568f70950") },
    { name: "Ghevar", price: 120, category: "Desserts", foodtype: "Veg", rating: { average: 4.3, count: 70 }, img: u("1567306226416-28f0efdc88ce") },
    { name: "Chicken Tikka", price: 250, category: "Indian", foodtype: "Non-Veg", rating: { average: 4.4, count: 95 }, img: u("1599487488170-d11ec9c172f0") },
    { name: "Malpua", price: 80, category: "Desserts", foodtype: "Veg", rating: { average: 4.2, count: 50 }, img: u("1551024506-0bccd828d307") },
  ],
  // Kolkata Bites
  [
    { name: "Kathi Roll", price: 100, category: "Snacks", foodtype: "Non-Veg", rating: { average: 4.6, count: 140 }, img: u("1626700051175-6818013e1d4f") },
    { name: "Fish Fry", price: 180, category: "Indian", foodtype: "Non-Veg", rating: { average: 4.7, count: 120 }, img: u("1534422298391-e4f8c172dddb") },
    { name: "Rasgulla", price: 50, category: "Desserts", foodtype: "Veg", rating: { average: 4.8, count: 190 }, img: u("1666190053310-0a1eaa67d4e5") },
    { name: "Luchi Aloor Dom", price: 110, category: "Indian", foodtype: "Veg", rating: { average: 4.3, count: 80 }, img: u("1565557623262-b51c2513a641") },
    { name: "Egg Roll", price: 70, category: "Snacks", foodtype: "Non-Veg", rating: { average: 4.4, count: 100 }, img: u("1528735602780-2552fd46c7af") },
    { name: "Mishti Doi", price: 60, category: "Dairy", foodtype: "Veg", rating: { average: 4.5, count: 130 }, img: u("1488477181946-6428a0291777") },
    { name: "Chilli Chicken", price: 200, category: "Chinese", foodtype: "Non-Veg", rating: { average: 4.2, count: 75 }, img: u("1603133872878-684f208fb84b") },
    { name: "Sandesh", price: 45, category: "Desserts", foodtype: "Veg", rating: { average: 4.6, count: 110 }, img: u("1551024506-0bccd828d307") },
  ],
];

for (let i = 0; i < shops.length; i++) {
  const { img: sImg, ...sData } = shops[i];
  const shop = await Shop.create({ ...sData, owner: newOwner._id, image: sImg, items: [] });
  console.log(`✅ ${shop.name}`);
  for (const { img: iImg, ...iData } of itemsByShop[i]) {
    const item = await Item.create({ ...iData, shop: shop._id, image: iImg });
    shop.items.push(item._id);
  }
  await shop.save();
}

console.log("\n🎉 Done! All items have food-specific images.");
await mongoose.disconnect();
