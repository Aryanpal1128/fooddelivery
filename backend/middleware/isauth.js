import jwt from "jsonwebtoken";
const isauth = async (req ,res ,next)=>{ try {



    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }
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