import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { GiChickenOven } from "react-icons/gi";
import { BiLeaf } from "react-icons/bi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addtocart } from "../redux/userSlice";

function Itemcard({ data, index }) {
  const [numb, setNumb] = useState(0);
  const dispatch = useDispatch();
  const cartitem = useSelector(state=>state.user)

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.round(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<CiStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (numb > 0) {
      dispatch(
        addtocart({
          _id: data._id,
          name: data.name,
          price: data.price,
          image: data.image,
          shop: data.shop,
          quantity: numb,
          foodtype: data.foodtype,
        })
      );
      setNumb(0);
    } else {
      alert("Please add at least 1 item before adding to cart");
    }
  };

  return (
    <div
      key={index}
      className="w-[140px] h-[180px] md:w-[200px] md:h-[230px] flex flex-col rounded-2xl border-2 border-orange-400 bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/*  Image Section */}
      <div className="relative w-full h-[70%] overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />

        {/* Food Type Indicator (Veg / Non-Veg) */}
        <div className="absolute top-2 right-2 text-lg text-white bg-black/40 rounded-full p-1">
          {data.foodtype === "Veg" ? (
            <BiLeaf className="text-green-500" />
          ) : (
            <GiChickenOven className="text-red-500" />
          )}
        </div>
      </div>

      {/* 🧾 Info Section */}
      <div className="flex flex-col justify-between px-3 py-2 text-sm h-[30%] bg-white">
        <h3 className="font-semibold text-gray-800 truncate">{data.name}</h3>

        <div className="flex items-center gap-1 text-[12px]">
          {renderStars(data.rating?.average || 0)}
          <span className="ml-1 text-gray-500">
            ({data.rating?.count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-orange-600 font-semibold text-sm">
            ₹{data.price}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNumb((prev) => (prev > 0 ? prev - 1 : 0))}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
            >
              <FaMinus className="text-gray-600 text-xs" />
            </button>

            <p className="min-w-[20px] text-center font-medium">{numb}</p>

            <button
              onClick={() => setNumb((prev) => prev + 1)}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
            >
              <FaPlus className="text-gray-600 text-xs" />
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-full transition-all duration-300"
            >
              <AiOutlineShoppingCart className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itemcard;
