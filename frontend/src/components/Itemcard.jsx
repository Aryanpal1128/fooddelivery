import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addtocart, updateCartQuantity } from "../redux/userSlice";

function Itemcard({ data, index }) {
  const dispatch = useDispatch();
  const { cartitem } = useSelector(state => state.user);
  const cartEntry = cartitem?.find(item => item._id === data._id);
  const quantity = cartEntry?.quantity || 0;

  const handleIncrease = (e) => {
    e?.stopPropagation();
    if (quantity === 0) {
      dispatch(addtocart({
        _id: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        shop: data.shop,
        quantity: 1,
        foodtype: data.foodtype,
      }));
    } else {
      dispatch(updateCartQuantity({ _id: data._id, quantity: quantity + 1 }));
    }
  };

  const handleDecrease = (e) => {
    e?.stopPropagation();
    dispatch(updateCartQuantity({ _id: data._id, quantity: quantity - 1 }));
  };

  const isInCart = quantity > 0;

  return (
    <div
      key={index}
      className={`flex flex-col rounded-[14px] overflow-hidden bg-white dark:bg-[#141210] transition-colors border ${isInCart ? "border-[1.5px] border-[#e8650a]" : "border border-[#e5ddd5] dark:border-[#1e1c19]"}`}
    >
      {/* Image Section */}
      <div className="relative w-full overflow-hidden shrink-0 h-[160px] bg-[#f0ece6] dark:bg-[#1c1a17] transition-colors">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* Veg/non-veg dot */}
        <span
          className="absolute top-2 left-2 w-2 h-2 rounded-sm flex items-center justify-center bg-white dark:bg-[#141210] transition-colors"
          style={{ border: `1px solid ${data.foodtype === "Veg" ? "#22c55e" : "#ef4444"}` }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: data.foodtype === "Veg" ? "#22c55e" : "#ef4444" }} />
        </span>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1 p-[12px_14px] flex-1 justify-between">
        <div>
          <h3 className="font-medium text-[13px] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis text-[#1a1a1a] dark:text-[#ddd] transition-colors mb-[6px]">
            {data.name}
          </h3>

          <div className="flex items-center justify-between mb-[10px]">
            <span className="font-medium text-[14px] text-[#e8650a] dark:text-[#e8650a] transition-colors">₹{data.price}</span>
            <span className="text-[11px] text-[#666] dark:text-[#666] transition-colors">
              ★ {data.rating?.average ? data.rating.average.toFixed(1) : "4.5"}
            </span>
          </div>
        </div>

        {/* Add to cart button */}
        <div className="mt-auto transition-all duration-200 ease-in-out h-[36px]">
          {quantity > 0 ? (
            <div className="w-full h-[36px] bg-[#e8650a] rounded-[8px] flex items-center justify-between px-[4px]">
              <button
                onClick={handleDecrease}
                className="w-[28px] h-[28px] rounded-[6px] bg-white/20 border-none text-white text-[18px] cursor-pointer flex items-center justify-center transition-colors hover:bg-white/30"
              >
                <FaMinus style={{ fontSize: "14px" }} />
              </button>
              <span className="text-[15px] font-semibold text-white min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-[28px] h-[28px] rounded-[6px] bg-white/20 border-none text-white text-[18px] cursor-pointer flex items-center justify-center transition-colors hover:bg-white/30"
              >
                <FaPlus style={{ fontSize: "14px" }} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrease}
              className="w-full h-[36px] bg-[#e8650a] rounded-[8px] flex items-center justify-center text-white text-[18px] cursor-pointer transition-colors hover:bg-[#cf5807]"
            >
              <FaPlus style={{ fontSize: "18px" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Itemcard;
