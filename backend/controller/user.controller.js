import usermodel from '.././models/usermodel.js';

const getCurrentuser = async (req ,res ,next)=>{
try {
    
   
    const user = await usermodel.findById(req.userId);
    if(!user){
        return res.status(400).json({message:"user not found"})
    }
    return res.status(200).json({message:"user found",user})
} catch (error) {
    console.log("getcurrentuser",error)
}


}

export default getCurrentuser;