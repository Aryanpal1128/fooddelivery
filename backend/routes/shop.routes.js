import express from 'express';
import { createShop, getmyShop, getshopbycity } from '../controller/shop.controller.js';
import isauth from '../middleware/isauth.js';
import { upload } from '../middleware/multer.js';
const shoprouter = express.Router();


shoprouter.post("/createedit", isauth, upload.single("image"), createShop);


shoprouter.get("/getmyshop",isauth,getmyShop)
shoprouter.get("/getbycity/:city",isauth,getshopbycity)


export default shoprouter