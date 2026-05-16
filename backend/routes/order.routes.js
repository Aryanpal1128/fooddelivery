import express from 'express';
import isauth from '../middleware/isauth.js';
import { placeorder, createRazorpayOrder, verifyPayment, getmyorders } from '../controller/ordercontroller.js';

const orderrouter = express.Router();

// COD order
orderrouter.post("/placeorder", isauth, placeorder)

// Online payment — Step 1: create Razorpay order
orderrouter.post("/create-razorpay-order", isauth, createRazorpayOrder)

// Online payment — Step 2: verify signature & save order
orderrouter.post("/verify-payment", isauth, verifyPayment)

// Get logged-in user's orders
orderrouter.get("/myorders", isauth, getmyorders)

export default orderrouter