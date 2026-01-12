import usermodel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { sendotp } from "../utils/mail.js";

export const create = async (req, res) => {
  try {
    const { fullname, email, password, mobile, role } = req.body;

     if (!fullname || fullname.trim().length < 3)
      return res.status(400).send("Enter your full name");

     
      if (!email || email.trim() === "")
      return res.status(400).send("Please enter your email");

    if (!mobile || mobile.toString().length < 10)
      return res.status(400).send("Enter full mobile number");

    if (!password || password.length < 8)
      return res.status(400).send("Enter at least 8 characters in password");

    let existingUser = await usermodel.findOne({ email });
    if (existingUser)
      return res.status(400).send("You already have an account");

    const hashedPassword = await bcrypt.hash(password, 10);
console.log(usermodel)
    const user = await usermodel.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      mobile,
    });

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      secure: false,        // true if HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(201).json({ message: "Signup success", user });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

  if (!email || email.trim() === "")
      return res.status(400).send("Please enter your email");


    if (!password || password.length < 8)
      return res.status(400).send("Enter at least 8 characters in password");


  

    const exuser = await usermodel.findOne({ email });
  

    if (!exuser )
      return res.status(400).send("You need to create an account first");

    const isMatch = await bcrypt.compare(password, exuser.password);
    if (!isMatch) return res.status(401).send("Incorrect password");

    const token = await generateToken(exuser._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({ message: "Login success", user: exuser });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
export const signout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
export const sendingotp = async (req, res) => {
  try {
    const { email } = req.body;


    const user = await usermodel.findOne({ email });
    if (!user)
      return res.status(400).send("You need to create an account first");
     
    const otp = Math.floor(1000+Math.random()*9000).toString();
    user.resetotp=otp;
    user.otpexpire = new Date(Date.now() + 10 * 60 * 1000);
    user.isotpverified=false
    await user.save();

    await sendotp(email,otp)
    return res.status(200).json({message:"otp send succesfully"})

  } catch (error) {
    console.error("send otp error",error);
    res.status(500).send("Internal server error");
  }
};
export const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await  usermodel.findOne({email}) 
  console.log('User found:', user ? 'Yes' : 'No');
    console.log('Stored OTP:', user?.resetotp);
    console.log('Input OTP:', otp);
    console.log('OTP Expire:', user?.otpexpire);
    console.log('Current time:', new Date());



    if(!user || user.resetotp!=otp ||user.otpexpire.getTime()<Date.now()){
      return res.status(400).json({message:"invalid/expired otp"})
    }

   user.isotpverified= true;
   user.resetotp=undefined;
   user.otpexpire=undefined;
   await user.save();
   return res.status(200).json({message:"otp verified succes fully"})
  } catch (error) {
    console.error("send otp error",error);
    res.status(500).send("Internal server error");
  }
};
export const resetpassword = async (req, res) => {
  try {
    const { email, newpassword } = req.body;

    const user = await usermodel.findOne({email});
    if(!user || !user.isotpverified){
      return res.status(400).json({message:"invalid user"})
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

//     if (await bcrypt.compare(newpassword, user.password)) {
//   return res.status(400).json({ message: "New password cannot be same as old password" });
// }


    user.password = hashedPassword;
    user.isotpverified = false;
    await user.save();

    return res.status(200).json({message:"password changed successfully"});
  } catch (error) {
    console.error("reset password error", error);
    res.status(500).send("Internal server error");
  }
};
export const google = async (req, res) => {
  try {
    const { fullname, email,role } = req.body;

    let user = await usermodel.findOne({ email });

    if (!user) {
      // If new user, create one
      user = await usermodel.create({
        fullname,
        email,
        role,
      });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true if using https
    });

    return res.status(200).json({
      message: 'Google login successful',
      user,
      token,
    });
  } catch (error) {
    console.log('Google Create Error:', error);
    return res.status(500).json({ message: 'Google Auth failed' });
  }
};