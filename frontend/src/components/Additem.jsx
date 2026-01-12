import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverurl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setshopData } from "../redux/ownerslice";

function Additem() {
  const navigate = useNavigate();
  const { shopData } = useSelector((state) => state.owner);
 const dispatch = useDispatch();
  
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
 
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");

  const categories = [
    "Snacks",
    "Fruits",
    "Dairy",
    "Indian",
    "Pizza",
    "Burger",
    "Chinese",
    "Desserts",
  ];

  const [image, setImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [loading, setLoading] = useState(false);

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setImage(URL.createObjectURL(file));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName || !price  || !category || !foodType) {
      alert("Please fill all fields before submitting!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("price", price);
      
      formData.append("category", category);
      formData.append("foodtype", foodType);
      formData.append("image", backendImage);

      const response = await axios.post(`${serverurl}/api/item/additem`,
        formData,
        { withCredentials: true }
      );
      const shopRes = await axios.get(`${serverurl}/api/shop/getmyshop`, { withCredentials: true });
dispatch(setshopData(shopRes.data));

      
      alert("Item added successfully!");
      navigate(-1);
      setLoading(false)
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100 p-6">
      {/* Back Button */}
      <div
        onClick={() => navigate(-1)}
        className="self-start flex items-center gap-1 text-gray-600 hover:text-orange-500 cursor-pointer mb-4"
      >
        <IoIosArrowBack size={22} />
        <span className="text-sm font-medium">Back</span>
      </div>

      {/* Main Form Card */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🍔 Add New Item
        </h2>

        {shopData ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Item Name */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Item Name
              </label>
              <input
                type="text"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Food Type */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Food Type
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="foodtype"
                    value="Veg"
                    checked={foodType === "Veg"}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="accent-green-600"
                  />
                  Veg 🌱
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="foodtype"
                    value="Non-Veg"
                    checked={foodType === "Non-Veg"}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="accent-red-600"
                  />
                  Non-Veg 🍗
                </label>
              </div>
            </div>

           

            {/* Image Upload */}
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">
                Item Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 cursor-pointer text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
              />
              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-lg mt-3 border"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:from-orange-500 hover:to-pink-600 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </form>
        ) : (
          <p className="text-gray-600 text-center">
            Please create your shop before adding items.
          </p>
        )}
      </div>
    </div>
  );
}

export default Additem;
