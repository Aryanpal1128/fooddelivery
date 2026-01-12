import dotenv from "dotenv";
dotenv.config();

import express from 'express';

import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"

import authrouter from  './routes/auth.routes.js';
import userrouter from './routes/userrouter.js';
import bodyParser from 'body-parser';
import shoprouter from "./routes/shop.routes.js";

import itemrouter from "./routes/item.routes.js";
import orderrouter from "./routes/order.routes.js";


mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("mongo connected")}).catch((err)=>console.log(err))


const app = express();
 const port = process.env.PORT || 5000;


// cors ka kaam 
app.use(
    cors({
        origin : 'http://localhost:5173' ,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],

        allowedHeaders:[
            'content-type',
            'authorization',
            'cache-control',
            'expires',
            'pragma'
        ],
        credentials: true
    })
)


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/auth", authrouter)
app.use("/api/user",userrouter)
app.use("/api/shop",shoprouter)
app.use("/api/item",itemrouter)
app.use("/api/order",orderrouter)











app.listen(port)