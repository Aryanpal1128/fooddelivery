import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
    
  },
 

});

export const sendotp = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Food Delivery App" <${process.env.EMAIL}>`,
      to,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    });
    console.log(" OTP sent to:", to);
    return info;
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw err;
  }
};
