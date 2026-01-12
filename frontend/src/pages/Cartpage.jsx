import React from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Cartitems from "./Cartitems";
import { useEffect } from "react";
import axios from "axios";
import { serverurl } from "../App";
import { clearUserData } from '../redux/userSlice';
import empty from "../assets/empty.png";

function Cartpage() {

  const dispatch= useDispatch()
  const navigate = useNavigate();
   const { userData, cartitem ,totalamount } = useSelector((state) => state.user);
useEffect(() => {
  if (!userData) navigate("/login");
}, [userData, navigate]);

  const handleSignout = async () => {
    try {
      await axios.get(`${serverurl}/api/auth/signout`, { withCredentials: true });
      dispatch(clearUserData());
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
     <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-all duration-300"
          >
            <IoChevronBackOutline className="text-lg" />
            
          </button>
          <h1 className="text-3xl font-bold text-orange-600 drop-shadow-sm">
            Your Cart
          </h1>
        </div>

        <button
          onClick={handleSignout}
          className="bg-red-50 text-red-500 font-semibold px-4 py-2 rounded-full hover:bg-red-100 transition-colors duration-300 shadow-sm"
        >
          Log Out
        </button>
      </div>
      {/* Cart Items */}
      <div>
      {cartitem.length === 0 ? (
         <div className="flex flex-col items-center justify-center text-center h-[60vh] text-gray-500">
          <img
            src={empty}
            alt="../assets/empty.png"
            className="w-36 mb-4  opacity-80"
          />
          <h2 className="text-lg font-medium">Your cart is empty </h2>
          <p className="text-sm mt-2 text-gray-400">
            Add delicious items to your cart and come back here!
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-300"
          >
            Back to main page
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cartitem.map((item, index) => (
            <Cartitems data={item} key={index} />
          ))}
        </div>
      )}
{totalamount>0 && 
 <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-gray-700 mb-6 border-b pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalamount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹40.0</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 pt-3 border-t">
                <span>Total</span>
            <span>₹{(totalamount + 40).toFixed(2)}</span>
              </div>
            </div>
        <button
        onClick={()=>{navigate("/checkout")}}
          className="mt-3 px-3 py-1 bg-orange-500 text-white rounded-full text-xs hover:bg-orange-600 transition"
        >
          Checkout
        </button>
      </div>
}
        
</div>
       
    </div>
  );
}

export default Cartpage;
