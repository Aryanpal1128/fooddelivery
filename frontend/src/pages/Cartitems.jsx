
import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

import { updateCartQuantity, removeFromCart } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Cartitems({ data, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  

  const [numb, setNumb] = useState(() => (data?.quantity ?? 1));

  useEffect(() => {
    dispatch(updateCartQuantity({ _id: data._id, quantity: numb }));
  
  }, [numb, dispatch, data._id]);



 

  return (
    <>
    <div
      className="flex gap-4 items-center p-4 rounded-2xl border border-gray-200 bg-white shadow-sm"
      key={ index}
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">
          {data.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">₹{data.price} each</p>

        <div className="flex items-center gap-4 mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
            <button
              onClick={() => setNumb((p) => (p > 1 ? p - 1 : 0))}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="decrease"
            >
              <FaMinus className="text-gray-600 text-sm" />
            </button>

            <div className="min-w-[36px] text-center font-medium">{numb}</div>

            <button
              onClick={() => setNumb((p) => p + 1)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="increase"
            >
              <FaPlus className="text-gray-600 text-sm" />
            </button>
          </div>

          {/* Item total */}
         <div className="flex flex-col items-end gap-2 ml-auto">
        <div className="text-xs text-gray-400">Total</div>
        <div className="text-sm font-bold text-gray-900">₹{(data.price * numb).toFixed(0)}</div>

      
      </div>

       
        </div>
      </div>

    
    </div>
  

     </>
  );
}

export default Cartitems;
