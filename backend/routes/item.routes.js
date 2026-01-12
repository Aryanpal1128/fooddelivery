import express from 'express';
import { itemcontrol, edititem, getitembyid, deleteitem, getitembycity } from '../controller/item.controller.js';
import isauth from '../middleware/isauth.js';
import { upload } from '../middleware/multer.js';
const itemrouter = express.Router();



itemrouter.post("/additem",isauth,upload.single("image"),itemcontrol)
itemrouter.get("/getitem/:itemId",isauth,getitembyid)
itemrouter.get("/deleteitem/:itemId",isauth,deleteitem)
itemrouter.get("/getitembycity/:city",isauth,getitembycity)
itemrouter.post("/edititem/:itemId",isauth,upload.single("image"),edititem)


export default itemrouter