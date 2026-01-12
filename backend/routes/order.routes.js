import express from 'express';
import { createShop, getmyShop, getshopbycity } from '../controller/shop.controller.js';
import isauth from '../middleware/isauth.js';
import { upload } from '../middleware/multer.js';
import { placeorder } from '../controller/ordercontroller.js';
const orderrouter = express.Router();





orderrouter.post("/placeorder",isauth,placeorder)



export default orderrouter