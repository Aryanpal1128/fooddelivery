import jwt from "jsonwebtoken";
const isauth = async (req ,res ,next)=>{ try {



    const token = req.cookies?.token 
    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if(!decoded){
        return res.status(400).json({message:"Invalid Token"})
    }
    req.userId = decoded.userId;

    next();
  

  } catch (error) {
    return res.status(403).json({ message: "isAuth error" });
  }

}
export default isauth;