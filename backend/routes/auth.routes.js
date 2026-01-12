import express from 'express';
import { create,resetpassword,sendingotp,signin,signout, verifyotp ,google} from "../controller/auth.controller.js"
const authrouter = express.Router();


authrouter.post("/create",create)
authrouter.post("/signin",signin)
authrouter.get("/signout",signout)
authrouter.post("/sendingotp",sendingotp)
authrouter.post("/verifyotp",verifyotp)
authrouter.post("/resetpassword",resetpassword)
authrouter.post('/google', google);


export default authrouter