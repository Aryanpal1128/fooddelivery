import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { serverurl } from '../App';

import { setshopData } from '../redux/ownerslice';
import axios from 'axios';
function Createeditshop() {
  const navigate = useNavigate();
  const{ shopData}= useSelector((state)=> state.owner);
  const{ city,state,caddress}= useSelector((state)=> state.user);
  const[shopname,setshopname]=useState(shopData?.name || "");
  const[shopimage,setshopimage]=useState(shopData?.image || "");
  const[backendimage,setbackendimage]=useState("")
  const[City,setcity]=useState(shopData?.city || city);
  const [stateName, setStateName] = useState(shopData?.state || state);

  const[address,setaddress]=useState(shopData?.address ||caddress);
  const dispatch = useDispatch();

  const handleimage=(e)=>{
    const file = e.target.files[0]
    setbackendimage(file)
    setshopimage(URL.createObjectURL(file))

  }
 const handlesubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("shopname", shopname);
    formData.append("city", City);
    formData.append("state", stateName);
    formData.append("address", address);
    if (backendimage) {
      formData.append("image", backendimage);
    

    }
const result = await axios.post(`${serverurl}/api/shop/createedit`, formData, { withCredentials: true });

     

    dispatch(setshopData(result.data));
    console.log("Shop saved:", result.data);
    navigate("/")
  } catch (error) {
    console.error("Error creating/editing shop:", error);
  }
};



  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100 flex flex-col items-center p-6
">
      
      {/* Back Button */}
      <div 
        onClick={() => navigate(-1)} 
        className="self-start flex items-center gap-1 text-gray-600 hover:text-orange-500 cursor-pointer mb-4"
      >
        <IoIosArrowBack size={22} />
        <span className="text-sm font-medium">Back</span>
      </div>

  

      {/* Form Container */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-lg">


        {/* Header */}
      <div className="items-center gap-3 mb-8">
        
        <GiForkKnifeSpoon className="text-orange-500 text-7xl ml-45" />
        <h2 className="text-3xl font-bold text-gray-800">Edit Shop</h2>
      </div>

        <form className="space-y-5" onSubmit={handlesubmit}>
          {/* Shop Name */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">Shop Name</p>
            <input 
              type="text" 
              placeholder="Enter your shop name" 
              onChange={(e)=>setshopname(e.target.value)}
              value={shopname ??""}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
            />

          
          </div>

          {/* Shop Image */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">Shop Image</p>
            <input 
              type="file" 
              onChange={handleimage}
              
              className="w-full border border-gray-300 rounded-xl px-3 py-2 cursor-pointer text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
            /> 
            {shopimage &&
            <div>
              <img src={shopimage} alt="" className='w-full h-48 object-cover rounded-lg border' />
            </div>
            }
             
          </div>

          {/* City */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">City</p>
            <input 
              type="text" 
              onChange={(e)=>setcity(e.target.value)}
              value={City}
              placeholder="Enter your city" 
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* State */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">State</p>
            <input 
              type="text" 
              placeholder="Enter your state" 
              onChange={(e)=>setStateName(e.target.value)}
              value={stateName}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Address */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">Address</p>
            <textarea 
              placeholder="Enter your shop address" 
              rows="3"
              onChange={(e)=>setaddress(e.target.value)}
              value={address}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:from-orange-500 hover:to-pink-600 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Createeditshop;
