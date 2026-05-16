import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverurl } from "../App";
import { useSelector } from "react-redux";
import { MdSave, MdOutlineRestaurant } from "react-icons/md";

function Edititem() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { shopData } = useSelector((state) => state.owner);

  const [currentitem, setcurrentitem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [image, setImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Snacks","Fruits","Dairy","Indian","Pizza","Burger","Chinese","Desserts"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !price || !category || !foodType) {
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
      await axios.post(`${serverurl}/api/item/edititem/${itemId}`, formData, { withCredentials: true });
      navigate(-1);
    } catch (error) {
      console.error("Error editing item:", error);
      alert("Error updating item. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handlegetitem = async () => {
      const result = await axios.get(`${serverurl}/api/item/getitem/${itemId}`, { withCredentials: true });
      setcurrentitem(result.data);
    };
    handlegetitem();
  }, [itemId]);

  useEffect(() => {
    if (currentitem) {
      setItemName(currentitem.name || "");
      setPrice(currentitem.price || "");
      setCategory(currentitem.category || "");
      setFoodType(currentitem.foodtype || "");
      setImage(currentitem.image || "");
    }
  }, [currentitem]);

  const inputStyle = {
    background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff",
    outline: "none", width: "100%", padding: "12px 16px", borderRadius: "12px", fontSize: "14px",
  };
  const labelStyle = { color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "8px" };

  return (
    <div className="min-h-screen" style={{ background: "#111111" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-5 py-4"
        style={{ background: "#161616", borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-xl"
          style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", width: "36px", height: "36px", color: "#9ca3af" }}>
          <IoChevronBack style={{ fontSize: "18px" }} />
        </button>
        <div>
          <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>Edit Item</h1>
          <p style={{ color: "#6b7280", fontSize: "12px" }}>Update item details</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {shopData ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Item Name */}
            <div>
              <label style={labelStyle}>Item Name</label>
              <input type="text" placeholder="e.g. Margherita Pizza" value={itemName}
                onChange={(e) => setItemName(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#f97316"}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
            </div>

            {/* Price */}
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input type="number" placeholder="e.g. 249" value={price}
                onChange={(e) => setPrice(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#f97316"}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select category</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat} style={{ background: "#1e1e1e" }}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Food Type */}
            <div>
              <label style={labelStyle}>Food Type</label>
              <div className="flex gap-3">
                {[{ label: "🌱 Veg", value: "Veg", color: "#22c55e" }, { label: "🍗 Non-Veg", value: "Non-Veg", color: "#ef4444" }].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setFoodType(opt.value)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={foodType === opt.value
                      ? { background: opt.value === "Veg" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", border: `1.5px solid ${opt.color}`, color: opt.color }
                      : { background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#9ca3af" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label style={labelStyle}>Item Image</label>
              <div className="rounded-2xl overflow-hidden cursor-pointer"
                style={{ border: "2px dashed #2a2a2a", background: "#1a1a1a" }}>
                {image ? (
                  <img src={image} alt="preview" className="w-full object-cover" style={{ height: "180px" }} />
                ) : (
                  <label htmlFor="edit-image" className="flex flex-col items-center justify-center gap-2 py-10 cursor-pointer">
                    <MdOutlineRestaurant style={{ fontSize: "36px", color: "#2a2a2a" }} />
                    <span style={{ color: "#6b7280", fontSize: "13px" }}>Click to upload image</span>
                  </label>
                )}
                <input id="edit-image" type="file" onChange={handleImageChange} className="hidden" />
              </div>
              {image && (
                <label htmlFor="edit-image" style={{ color: "#f97316", fontSize: "12px", cursor: "pointer", display: "block", marginTop: "6px" }}>
                  Change image
                </label>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 mt-2"
              style={{ background: "#f97316", color: "#fff", opacity: loading ? 0.7 : 1 }}>
              <MdSave size={18} />
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center rounded-2xl"
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <span style={{ fontSize: "40px" }}>🏪</span>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>Please create your shop before editing items.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Edititem;
