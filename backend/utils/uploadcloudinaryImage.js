


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

 const uploadcloudinaryImage = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "fooddelivery",
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);
    throw err;
  }
};
 export default uploadcloudinaryImage