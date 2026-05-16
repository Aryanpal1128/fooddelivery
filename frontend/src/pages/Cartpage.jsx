import React from "react";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Cartitems from "./Cartitems";
import { useEffect } from "react";
import axios from "axios";
import { serverurl } from "../App";
import { clearUserData } from '../redux/userSlice';
import empty from "../assets/empty.png";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";

function Cartpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, cartitem, totalamount } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) navigate("/signin");
  }, [userData, navigate]);

  const handleSignout = async () => {
    try {
      await axios.get(`${serverurl}/api/auth/signout`, { withCredentials: true });
      dispatch(clearUserData());
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const deliveryFee = totalamount > 300 ? 0 : 40;

  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-[#0f0e0c] transition-colors pb-24">
      <Nav />
      {/* ── CONTENT ── */}
      <div className="max-w-1280 mx-auto px-[16px] md:px-[48px] pt-[32px]">
        {/* ── PAGE HEADER BELOW NAVBAR ── */}
        <div className="mb-[24px] pb-[20px] border-b border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
          <h1 className="text-[24px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">
            Your Cart
          </h1>
          <p className="text-[13px] text-[#666] dark:text-[#666] mt-[4px] transition-colors">
            {cartitem?.length || 0} {cartitem?.length === 1 ? "item" : "items"}
          </p>
        </div>

        {cartitem?.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', textAlign: 'center' }}>
            <AiOutlineShoppingCart style={{ fontSize: '72px', marginBottom: '16px' }} className="text-[#ddd] dark:text-[#2a2825] transition-colors" />
            <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }} className="text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">
              Your cart is empty
            </h2>
            <p style={{ fontSize: '14px', marginBottom: '24px' }} className="text-[#666] transition-colors">
              Add items from the menu to get started
            </p>
            <button
              onClick={() => navigate("/")}
              style={{ background: '#e8650a', color: 'white', padding: '12px 36px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          /* ── TWO COLUMN LAYOUT ── */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[24px]">
            {/* Left Column: Cart Items */}
            <div className="flex flex-col">
              {cartitem.map((item, index) => (
                <Cartitems data={item} key={index} />
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="relative">
              <div className="sticky top-[24px] bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] rounded-[16px] p-[24px] transition-colors">
                <h2 className="text-[18px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] mb-[20px] pb-[16px] border-b border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-0">
                  <div className="flex justify-between py-[10px] border-b border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                    <span className="text-[14px] text-[#666] dark:text-[#666] transition-colors">Subtotal</span>
                    <span className="text-[14px] text-[#1a1a1a] dark:text-[#ddd] transition-colors">₹{totalamount}</span>
                  </div>
                  <div className="flex justify-between py-[10px] border-b border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                    <span className="text-[14px] text-[#666] dark:text-[#666] transition-colors">Delivery Fee</span>
                    <span className="text-[14px] text-[#1a1a1a] dark:text-[#ddd] transition-colors">
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-[16px] mt-[4px]">
                    <span className="text-[16px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">Total</span>
                    <span className="text-[18px] font-semibold text-[#e8650a]">₹{totalamount + deliveryFee}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-[20px] h-[50px] rounded-[12px] bg-[#e8650a] border-none text-[15px] font-semibold text-white cursor-pointer flex items-center justify-center gap-[8px]"
                >
                  Proceed to Checkout &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cartpage;
