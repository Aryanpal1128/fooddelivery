import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearUserData } from "../redux/userSlice";
import { serverurl } from "../App";
import { TiShoppingCart } from "react-icons/ti";

function Nav() {
  const { userData } = useSelector((state) => state.user);
  const [info, setInfo] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  handle logout safely
  const handleSignout = async () => {
    try {
      await axios.get(`${serverurl}/api/auth/signout`, { withCredentials: true });
      dispatch(clearUserData());
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Prevent unauthorized render navigation
  useEffect(() => {
    if (!userData) {
      navigate("/signin");
    }
  }, [userData, navigate]);

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1
        className="text-2xl font-bold text-orange-500 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Foodie
      </h1>

      <div className="flex items-center gap-4 relative">
        {/* Cart */}
        <TiShoppingCart
          className="text-3xl text-gray-700 hover:text-orange-500 cursor-pointer"
          onClick={() => navigate("/cart")}
        />

        {/* User Avatar */}
        {userData && (
          <div
            onClick={() => setInfo(!info)}
            className="w-9 h-9 rounded-full bg-orange-500 text-white flex justify-center items-center font-semibold cursor-pointer hover:scale-105 transition-transform"
          >
            {userData.fullname.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Dropdown */}
        {info && (
          <div className="absolute right-0 top-12 bg-white shadow-md rounded-xl py-3 px-4 border border-gray-100 w-44 animate-fadeIn">
            <p className="font-semibold text-gray-700 mb-2">{userData.fullname}</p>
            <button
              onClick={() => navigate("/orders")}
              className="block w-full text-left text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md px-2 py-1 transition"
            >
              My Orders
            </button>
            <button
              onClick={handleSignout}
              className="block w-full text-left text-red-500 hover:bg-red-50 rounded-md px-2 py-1 mt-2 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
