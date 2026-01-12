import React, { useState } from 'react';

import axios from 'axios';
import { serverurl } from '../App';
import { useNavigate } from 'react-router-dom';
import {ClipLoader} from "react-spinners"

const Forgotpassword = () => {
  const navigate = useNavigate(); 
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const[Loading,setLoading]=useState(false )
  const handlesendotp = async ()=>{
    setLoading(true);
    try {
  const result = await axios.post(`${serverurl}/api/auth/sendingotp`, { email }, { withCredentials: true });
localStorage.setItem("resetEmail", email);
 setStep(2)
   console.log(result)
   setLoading(false);
} catch (error) {
  console.log(error)
}
  }
  const handleverify = async ()=>{
    setLoading(true);
    try {
   const result =  await axios.post(`${serverurl}/api/auth/verifyotp`, {email, otp }, { withCredentials: true });

 setStep(3)
   console.log("verify otp ",result)
   setLoading(false);
} catch (error) {
  console.log(error)
}
  }
  const handleresetpassword = async ()=>{
    setLoading(true);
    try {
      if(password!==confirm) return alert("Passwords do not match");
   const result =  await axios.post(`${serverurl}/api/auth/resetpassword`, {
    email,
      newpassword: password
}, {
  withCredentials: true 
});

console.log(result.data);
navigate("/signin")
   console.log(result)
   setLoading(false);
} catch (error) {
  console.log(error)
}
  }

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100 p-6">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md transition-transform transform hover:scale-[1.02] space-y-8">

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 drop-shadow-sm">
            Forgot Password
          </h1>

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                onClick={handlesendotp}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-sky-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              disabled={Loading}
            
              >
                 {Loading ? <ClipLoader size={20} /> : "Send otp"}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-gray-700 font-semibold mb-2">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                onClick={handleverify}
                disabled={Loading}
            
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-sky-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                {Loading ? <ClipLoader size={20} /> : "verify otp"} 
              </button>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-gray-700 font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  placeholder="Confirm new password"
                  onChange={(e) => setConfirm(e.target.value)}
                  value={confirm}
                  className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                onClick={handleresetpassword}
                disabled={Loading}
            
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-sky-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                {Loading ? <ClipLoader size={20} /> : "reset password"} 
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Forgotpassword;
