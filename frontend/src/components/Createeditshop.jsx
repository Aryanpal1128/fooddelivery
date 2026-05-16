import React, { useState } from 'react';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { serverurl } from '../App';
import { setshopData } from '../redux/ownerslice';
import axios from 'axios';
import { MdStorefront } from "react-icons/md";

function Createeditshop() {
  const navigate = useNavigate();
  const { shopData } = useSelector((state) => state.owner);
  const { city, state, caddress } = useSelector((state) => state.user);

  const [shopname, setshopname] = useState(shopData?.name || "");
  const [shopimage, setshopimage] = useState(shopData?.image || "");
  const [backendimage, setbackendimage] = useState("");
  const [City, setcity] = useState(shopData?.city || city);
  const [stateName, setStateName] = useState(shopData?.state || state);
  const [address, setaddress] = useState(shopData?.address || caddress);
  const dispatch = useDispatch();

  const handleimage = (e) => {
    const file = e.target.files[0];
    setbackendimage(file);
    setshopimage(URL.createObjectURL(file));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("shopname", shopname);
      formData.append("city", City);
      formData.append("state", stateName);
      formData.append("address", address);
      if (backendimage) formData.append("image", backendimage);
      const result = await axios.post(`${serverurl}/api/shop/createedit`, formData, { withCredentials: true });
      dispatch(setshopData(result.data));
      navigate("/");
    } catch (error) {
      console.error("Error creating/editing shop:", error);
    }
  };

  const inputStyle = {
    background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff",
    outline: "none", width: "100%", padding: "12px 16px", borderRadius: "12px", fontSize: "14px",
  };
  const labelStyle = { color: "#9ca3af", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "8px" };

  return (
    <div className="min-h-screen" style={{ background: "#111111" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-6 md:px-16 py-4 md:py-6"
        style={{ background: "#161616", borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-xl"
          style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", width: "36px", height: "36px", color: "#9ca3af" }}>
          <IoChevronBack style={{ fontSize: "18px" }} />
        </button>
        <div>
          <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
            {shopData ? "Edit Shop" : "Create Shop"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "12px" }}>
            {shopData ? "Update your restaurant details" : "Set up your restaurant profile"}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 md:px-12 pt-6 md:pt-10 pb-24">
        {/* Icon header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center rounded-full mb-3"
            style={{ background: "rgba(249,115,22,0.15)", width: "72px", height: "72px" }}>
            <MdStorefront style={{ fontSize: "34px", color: "#f97316" }} />
          </div>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "20px" }}>
            {shopData ? "Update Restaurant" : "New Restaurant"}
          </h2>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handlesubmit}>
          {/* Shop Name */}
          <div>
            <label style={labelStyle}>Restaurant Name</label>
            <input type="text" placeholder="e.g. Spice Garden" onChange={(e) => setshopname(e.target.value)} value={shopname ?? ""}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#f97316"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
          </div>

          {/* Shop Image */}
          <div>
            <label style={labelStyle}>Restaurant Image</label>
            <div className="rounded-2xl overflow-hidden cursor-pointer"
              style={{ border: "2px dashed #2a2a2a", background: "#1a1a1a" }}>
              {shopimage ? (
                <img src={shopimage} alt="shop" className="w-full object-cover" style={{ height: "180px" }} />
              ) : (
                <label htmlFor="shop-image" className="flex flex-col items-center justify-center gap-2 py-10 cursor-pointer">
                  <GiForkKnifeSpoon style={{ fontSize: "36px", color: "#2a2a2a" }} />
                  <span style={{ color: "#6b7280", fontSize: "13px" }}>Click to upload shop image</span>
                </label>
              )}
              <input id="shop-image" type="file" onChange={handleimage} className="hidden" />
            </div>
            {shopimage && (
              <label htmlFor="shop-image" style={{ color: "#f97316", fontSize: "12px", cursor: "pointer", display: "block", marginTop: "6px" }}>
                Change image
              </label>
            )}
          </div>

          {/* City */}
          <div>
            <label style={labelStyle}>City</label>
            <input type="text" onChange={(e) => setcity(e.target.value)} value={City} placeholder="e.g. Mumbai"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#f97316"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
          </div>

          {/* State */}
          <div>
            <label style={labelStyle}>State</label>
            <input type="text" placeholder="e.g. Maharashtra" onChange={(e) => setStateName(e.target.value)} value={stateName}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#f97316"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
          </div>

          {/* Address */}
          <div>
            <label style={labelStyle}>Full Address</label>
            <textarea placeholder="Enter your full shop address" rows="3"
              onChange={(e) => setaddress(e.target.value)} value={address}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#f97316"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
          </div>

          {/* Submit */}
          <button type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 mt-2"
            style={{ background: "#f97316", color: "#fff" }}>
            <MdStorefront size={18} />
            {shopData ? "Save Changes" : "Create Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Createeditshop;
