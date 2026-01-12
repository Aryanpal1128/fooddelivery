import React, { useState } from 'react';
import { IoEye } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {useNavigate} from "react-router-dom"
import axios from "axios";
import { serverurl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import {ClipLoader} from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const signin = () => {
  const [showpassword,setpassword]=useState(false);
  const [role,setrole]= useState("user");
  const navigate = useNavigate();
   const[Err,setErr]=useState("")
  const[email,setemail]=useState("") 
  const[password,setpass]=useState("")
   const[Loading,setLoading]=useState(false )
   const dispatch = useDispatch();
const handlesignin= async ()=>{
try {
  setLoading(true);
   const result =  await axios.post(`${serverurl}/api/auth/signin`, {
   email, password
}, {
  withCredentials: true  
})
   dispatch(setUserData(result.data))
   console.log(result)
   setErr("")
   setLoading(false);
} catch (error) {
  setLoading(false);
  if ( error.response) {
    console.log("Server Error:", error.response.data);
    setErr(error.response.data || "Something went wrong");
  } else {
    console.error("Client Error:", error.message);
    setErr(error.message);
  }
}
}
const googleauth = async ()=>{
  try {

  

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);
    const response = await axios.post(`${serverurl}/api/auth/google`, {
      email: result.user.email,
    }, {
      withCredentials: true  
    })  

    dispatch(setUserData(response.data));
    console.log(response.data)
  } catch (error) {
     console.error("Google Auth Error:", error);
  if (error.response) setErr(error.response.data);
  else setErr(error.message);
  }
  
}


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100 p-6 ">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md transition-transform transform hover:scale-[1.02] ">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-sky-700 mb-3 text-center tracking-tight">
          FoodApp
        </h1>
        <h3 className="text-gray-600 mb-8 text-center text-sm">
          Fill out the form to continue 🍔
        </h3>

    

        <form className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 mr-74">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
               onChange={(e)=>setemail(e.target.value)}
              value={email} required
              className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
            />
          </div>

        

          {/* Password */}
          <div className='relative'>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2 mr-65">
               Password
            </label>
            <input
              id="password"
              type={`${showpassword?"text":"password"}`}
               onChange={(e)=>setpass(e.target.value)}
              value={password}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 "
              
            />
            <button type='button' className='absolute right-3 top-12 cursor-pointer text-gray-500 hover:text-sky-600 ' onClick={()=>setpassword(prev=>!prev)}>{!showpassword? <IoEye />:<FaEyeSlash /> }</button>
          </div>


          <div className=' ' onClick={()=>navigate('/forgotpassword')}>
            Forgot password
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-sky-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handlesignin(); disabled={Loading}
            
            }}


          >
           {Loading ? <ClipLoader size={20} /> : "Signin"}
          </button>

          {/* signin with google */}
          <button
  type="button"
  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-sky-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
  onClick={googleauth}
>
  <FcGoogle size={22} />
  <span>Sign in with Google</span>
</button>


{/* do not have an account */}
<p className="text-center text-gray-600 text-sm mt-4" onClick={()=>navigate("/signup")}>
   create new account?{" "}
  <span className="text-sky-600 font-semibold cursor-pointer hover:underline hover:text-sky-700 transition-colors duration-200">
    signup
  </span>
</p>


        </form>
      </div>
    </div>
  );
};

export default signin;
