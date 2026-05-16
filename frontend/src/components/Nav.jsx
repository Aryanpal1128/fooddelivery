import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearUserData } from "../redux/userSlice";
import { serverurl } from "../App";
import { TiShoppingCart } from "react-icons/ti";
import { HiHome, HiOutlineHome } from "react-icons/hi2";
import { MdExplore, MdOutlineExplore, MdOutlineRestaurant } from "react-icons/md";
import { BsBagCheck, BsBagCheckFill } from "react-icons/bs";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoLocationOutline, IoSettings, IoSettingsOutline } from "react-icons/io5";
import { RiUser3Line, RiUser3Fill } from "react-icons/ri";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { LuCreditCard } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";

function Nav() {
  const { userData, cartitem, city } = useSelector((state) => state.user);
  const [info, setInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const handleSignout = async () => {
    try {
      await axios.get(`${serverurl}/api/auth/signout`, { withCredentials: true });
      dispatch(clearUserData());
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    if (!userData) navigate("/signin");
  }, [userData, navigate]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", iconActive: <HiHome />, icon: <HiOutlineHome /> },
    { path: "/explore", label: "Explore", iconActive: <MdExplore />, icon: <MdOutlineExplore /> },
    { path: "/orders", label: "My orders", iconActive: <BsBagCheckFill />, icon: <BsBagCheck /> },
    { path: "/saved", label: "Saved", iconActive: <FaBookmark />, icon: <FaRegBookmark /> },
    { path: "/addresses", label: "Addresses", iconActive: <IoLocationOutline />, icon: <IoLocationOutline /> },
  ];

  const accountLinks = [
    { path: "/profile", label: "Profile", iconActive: <RiUser3Fill />, icon: <RiUser3Line /> },
    { path: "/payments", label: "Payments", iconActive: <LuCreditCard />, icon: <LuCreditCard /> },
    { path: "/settings", label: "Settings", iconActive: <IoSettings />, icon: <IoSettingsOutline /> },
  ];

  return (
    <>
      <header
        className="w-full bg-white dark:bg-[#141210] border-b border-[#e5ddd5] dark:border-[#1e1c19] transition-colors"
      >
        <div className="max-w-1280 h-[64px] flex items-center justify-between">
          {/* Logo */}
          <div
            className="cursor-pointer text-[22px] font-medium text-[#e8650a] dark:text-[#e8650a]"
            onClick={() => navigate("/")}
          >
            Foodie
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: "Home", path: "/" },
              { name: "Track order", path: "/orders" }
            ].map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`transition-colors duration-200 text-[13px] ${
                    isActive
                      ? "bg-transparent dark:bg-[#1a1208] text-[#e8650a] dark:text-[#e8650a] rounded-[50px] px-[14px] py-[7px]"
                      : "text-[#444] dark:text-[#666]"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
            {/* Restaurants — scrolls to #restaurants section */}
            <button
              onClick={() => {
                if (location.pathname === "/") {
                  document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/");
                  setTimeout(() => {
                    document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" });
                  }, 400);
                }
              }}
              className={`transition-colors duration-200 text-[13px] text-[#444] dark:text-[#666]`}
            >
              Restaurants
            </button>
            {/* Offers placeholder */}
            <button
              onClick={() => navigate("/")}
              className="transition-colors duration-200 text-[13px] text-[#444] dark:text-[#666]"
            >
              Offers
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Location Pill */}
            <div
              className="hidden md:flex items-center gap-2 rounded-[50px] px-[14px] py-[6px] text-[12px] bg-transparent border-transparent dark:bg-[#1c1a17] border dark:border-[#2a2825] text-[#666] dark:text-[#ccc] transition-colors"
            >
              <span className="inline-block rounded-full w-[6px] h-[6px] bg-[#e8650a]" />
              {city || "Greater Noida"}
            </div>


            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#e5ddd5] dark:border-[#2a2825] bg-[#f0ece6] dark:bg-[#1c1a17] hover:bg-[#e5ddd5] dark:hover:bg-[#2a2825] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <i className="ti ti-sun text-yellow-400 text-lg" />
              ) : (
                <i className="ti ti-moon text-[#666] text-lg" />
              )}
            </button>

            {/* Cart Pill */}
            <div
              className="cursor-pointer flex items-center gap-2 font-medium"
              style={{ background: "#e8650a", borderRadius: "50px", padding: "8px 18px", color: "#fff", fontSize: "13px" }}
              onClick={() => navigate("/cart")}
            >
              My cart
              {cartitem?.length > 0 && (
                <span
                  className="flex items-center justify-center rounded-full text-[#e8650a] font-bold"
                  style={{ background: "#fff", fontSize: "11px", minWidth: "18px", height: "18px", padding: "0 4px" }}
                >
                  {cartitem.length}
                </span>
              )}
            </div>

            {/* Avatar */}
            {userData && (
              <div
                onClick={() => setInfo(!info)}
                className="flex items-center justify-center rounded-full font-bold text-white cursor-pointer relative bg-[#e8650a] w-[36px] h-[36px] text-[14px]"
              >
                {userData?.fullname ? userData.fullname.charAt(0).toUpperCase() : "U"}

                {info && (
                  <div
                    className="absolute top-12 right-0 w-40 rounded-xl shadow-2xl py-2 z-50 animate-fadeInUp bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] transition-colors"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate("/orders"); setInfo(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-[#444] dark:text-[#ccc] hover:bg-[#f0ece6] dark:hover:bg-[#1c1a17]"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSignout(); }}
                      className="block w-full text-left px-4 py-2 text-sm text-[#ef4444] hover:bg-[#f0ece6] dark:hover:bg-[#1c1a17]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Nav;
