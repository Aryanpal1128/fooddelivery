
import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { updateCartQuantity, removeFromCart } from "../redux/userSlice";
import { useDispatch } from "react-redux";

function Cartitems({ data, index }) {
  const dispatch = useDispatch();
  const [numb, setNumb] = useState(() => (data?.quantity ?? 1));

  useEffect(() => {
    dispatch(updateCartQuantity({ _id: data._id, quantity: numb }));
  }, [numb, dispatch, data._id]);

  return (
    <div className="bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] rounded-[14px] p-[16px] mb-[12px] flex items-center gap-[14px] transition-colors">
      {/* Image */}
      <img src={data.image} alt={data.name} className="w-[80px] h-[80px] rounded-[10px] object-cover shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-medium text-[#1a1a1a] dark:text-[#f0ece6] whitespace-nowrap overflow-hidden text-ellipsis transition-colors">
          {data.name}
        </h3>
        <p className="text-[14px] text-[#e8650a] font-medium mt-[4px]">
          ₹{data.price}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-[12px] mt-[10px]">
          <button
            onClick={() => setNumb((p) => (p > 1 ? p - 1 : 0))}
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center bg-[#f5f0eb] dark:bg-[#1c1a17] border border-[#e5ddd5] dark:border-[#2a2825] text-[#444] dark:text-[#aaa] transition-colors"
          >
            <FaMinus style={{ fontSize: "10px" }} />
          </button>
          <span className="text-[15px] text-[#1a1a1a] dark:text-[#f0ece6] min-w-[20px] text-center transition-colors">
            {numb}
          </span>
          <button
            onClick={() => setNumb((p) => p + 1)}
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center bg-[#e8650a] border-none text-white transition-colors"
          >
            <FaPlus style={{ fontSize: "10px" }} />
          </button>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => dispatch(removeFromCart({ _id: data._id }))}
        className="ml-auto self-start w-[32px] h-[32px] rounded-[8px] flex items-center justify-center bg-[#fff3eb] dark:bg-[#1c1a17] border border-[#fdd5b0] dark:border-[#2a2825] text-[#e84040] transition-colors shrink-0"
      >
        <MdDeleteOutline style={{ fontSize: "16px" }} />
      </button>
    </div>
  );
}

export default Cartitems;
