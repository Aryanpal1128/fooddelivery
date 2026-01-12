import express from 'express';
import getCurrentuser from '..//controller/user.controller.js';
import isauth from '../middleware/isauth.js';
const userrouter = express.Router();



userrouter.get("/current",isauth,getCurrentuser)


export default userrouter