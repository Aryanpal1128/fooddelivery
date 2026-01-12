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
import {useDispatch} from  'react-redux'
import { setUserData } from '../redux/userSlice';

const Create = () => {
  const [showpassword,setpassword]=useState(false);
  const [role,setrole]= useState("");
  const navigate = useNavigate();
  const[fullname,setfullname]=useState("")
  const[email,setemail]=useState("")
  const[mobile,setmobile]=useState("")
  const[password,setpass]=useState("")
  const[Err,setErr]=useState("")
  const[Loading,setLoading]=useState(false )
 const dispatch = useDispatch();

const handlesignup= async ()=>{
try {
  setLoading(true);
   const result =  await axios.post(`${serverurl}/api/auth/create`, {
  fullname, email, password, mobile, role
}, {
  withCredentials: true  
})
  dispatch(setUserData(result.data));
   console.log(result)
   setErr("")
   setfullname("")
   setLoading(false);
} catch (error) {
 if ( error.response) {
    console.log("Server Error:", error.response.data);

    if(error.response.data=="You already have an account"){
      setfullname("")
      setemail("")
      setmobile("")
      setpass("")
    }
    setErr(error.response.data || "Something went wrong");
  } else {
    console.error("Client Error:", error.message);
    setErr(error.message);
     
  }

  setLoading(false);
 
}
}


// sign in  with google authentication
const googleauth = async ()=>{
  try {

    if(!role){
      setErr("Please select a role before signing up with Google.");
      return;
    }
 

  
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);

    const response = await axios.post(`${serverurl}/api/auth/google`, {
      fullname: result.user.displayName,
      email: result.user.email,
      role:  role,
      mobile
    }, {
      withCredentials: true  
    })
   

     dispatch(setUserData(response.data));
   console.log("Dispatched user:", response.data);
    setErr("")
  } catch (error) {
    console.error("Google Auth Error:", error);
  if (error.response) setErr(error.response.data);
  else setErr(error.message);
  }
}


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100 p-6">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md transition-transform transform hover:scale-[1.02]">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-sky-700 mb-3 text-center tracking-tight">
          FoodApp
        </h1>
        <h3 className="text-gray-600 mb-8 text-center text-sm">
          Fill out the form to continue 🍔
        </h3>

        {/* role */}
      <div className="space-y-6 mb-6">
  <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">
    Role
  </label>

  <div className="flex justify-between gap-3">
    {["User", "Owner", "Delivery Boy"].map((r) => (
      <button
        key={r}
        type="button"
        className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-sky-100 hover:text-sky-700 transition-all duration-200 shadow-sm hover:scale-[1.02]"
        onClick={()=>setrole(r)} style={role==r?{backgroundColor:'skyblue',color:'white'}:{border:'white',color:'blue',}
      }
      >
        {r}
      </button>
    ))}
  </div>
</div>

        {/* Form */}
        <form className="space-y-6">
          {/* Fullname */}
          <div>
            <label htmlFor="fullname" className="block text-gray-700 font-semibold mb-2 mr-65">
                Full Name
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              onChange={(e)=>setfullname(e.target.value)}
              value={fullname}
              required
              className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
            />
          </div>

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
              value={email}
              required
              className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-gray-700 font-semibold mb-2 mr-70">
              Mobile
            </label>
            <input
              id="mobile"
              type="number"
              maxLength={10}
              placeholder="Enter your mobile number"
               onChange={(e)=>setmobile(e.target.value)}
              value={mobile}
              required
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
              className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              
            />
            <button type='button' className='absolute right-3 top-12 cursor-pointer text-gray-500 hover:text-sky-600 ' onClick={()=>setpassword(prev=>!prev)}>{!showpassword? <IoEye />:<FaEyeSlash /> }</button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-sky-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handlesignup(); disabled={Loading}
             
            }}


          >
            {Loading ? <ClipLoader size={20} color='white' /> : "Signup"}
           
          </button>
            
           {Err && < p className=''>*{Err}</p> } 


          {/* signin with google */}
          <button
  type="button"
  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-sky-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer
  "onClick={googleauth}
>
  <FcGoogle size={22} />
  <span>Sign up with Google</span>
</button>

{/* Already have an account */}
<p className="text-center text-gray-600 text-sm mt-4" onClick={()=>navigate("/signin")}>
  Already have an account?{" "}
  <span className="text-sky-600 font-semibold cursor-pointer hover:underline hover:text-sky-700 transition-colors duration-200">
    Sign in
  </span>
</p>

        </form>
      </div>
    </div>
  );
};

export default Create;
