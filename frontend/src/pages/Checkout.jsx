import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { IoMdLocate } from "react-icons/io";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setaddress, setlocation } from '../redux/mapslice';
import { clearCart } from '../redux/userSlice';
import axios from 'axios';
import { MdElectricMoped } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { serverurl } from '../App';
import Nav from '../components/Nav';
import { FaArrowRight } from "react-icons/fa6";

const RecenterMap = ({ lat, lon }) => {
  if (lat && lon) {
    const map = useMap();
    map.setView([lat, lon], 16, { animate: true });
  }
  return null;
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const { location, address } = useSelector((state) => state.map);
  const { cartitem, totalamount } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentaddress, setcurrentaddress] = useState(address || "");
  const [paymentmethod, setpaymentmethod] = useState("");
  const [loading, setloading] = useState(false);
  const [toast, settoast] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const deliveryfee = totalamount > 300 ? 0 : 50;
  const amount = totalamount + deliveryfee;
  const lon = location.lon;
  const lat = location.lat;

  const showToast = (type, msg) => {
    settoast({ type, msg });
    setTimeout(() => settoast(null), 3500);
  };

  const handledragend = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setlocation({ lat, lon: lng }));
    getaddresslatlng(lat, lng);
  };

  const getaddresslatlng = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
      );
      const fullAddress = `${res.data.results[0].address_line1 || ''}, ${res.data.results[0].address_line2 || ''}`;
      dispatch(setaddress(fullAddress));
    } catch (error) {
      console.log("get address by lat lng", error);
    }
  };

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setlocation({ lat: latitude, lon: longitude }));
      getaddresslatlng(latitude, longitude);
    });
  };

  const getlatlngbyaddress = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(currentaddress)}&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
      );
      const lat = res.data.features[0].properties.lat;
      const lon = res.data.features[0].properties.lon;
      dispatch(setlocation({ lat, lon }));
    } catch (error) {}
  };

  const validate = () => {
    if (!currentaddress) { showToast("error", "Please enter a delivery address."); return false; }
    if (!paymentmethod) { showToast("error", "Please select a payment method."); return false; }
    if (!cartitem || cartitem.length === 0) { showToast("error", "Your cart is empty."); return false; }
    return true;
  };

  const handleCodOrder = async () => {
    try {
      setloading(true);
      await axios.post(`${serverurl}/api/order/placeorder`, {
        paymentmethod,
        address: { text: currentaddress, latitude: location.lat, longitude: location.lon },
        totalamount,
        cartitem,
      }, { withCredentials: true });
      showToast("success", "Order placed successfully! 🎉");
      dispatch(clearCart());
      setTimeout(() => navigate("/orders"), 1800);
    } catch (error) {
      showToast("error", "Failed to place order. Please try again.");
    } finally {
      setloading(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setloading(true);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { showToast("error", "Failed to load payment gateway."); setloading(false); return; }

      const { data } = await axios.post(`${serverurl}/api/order/create-razorpay-order`, { amount }, { withCredentials: true });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount, currency: data.currency,
        name: "Foodie", description: `Order of ₹${amount}`, order_id: data.orderId,
        handler: async (response) => {
          try {
            await axios.post(`${serverurl}/api/order/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: { text: currentaddress, latitude: location.lat, longitude: location.lon },
              totalamount, cartitem,
            }, { withCredentials: true });
            showToast("success", "Payment successful! Order placed 🎉");
            dispatch(clearCart());
            setTimeout(() => navigate("/orders"), 1800);
          } catch (err) {
            showToast("error", "Payment done but order saving failed. Contact support.");
          }
        },
        theme: { color: "#f97316" },
        modal: { ondismiss: () => { showToast("error", "Payment cancelled."); setloading(false); } },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      setloading(false);
    } catch (error) {
      showToast("error", "Could not initiate payment. Please try again.");
      setloading(false);
    }
  };

  const handleorder = () => {
    if (!validate()) return;
    if (paymentmethod === "cod") handleCodOrder();
    else handleOnlinePayment();
  };

  const sectionStyle = { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "20px", marginBottom: "16px" };

  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-[#0f0e0c] transition-colors pb-24">
      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
            zIndex: 9999, padding: "12px 24px", borderRadius: "12px", fontWeight: 600, fontSize: "14px",
            color: "#fff", backgroundColor: toast.type === "success" ? "#22c55e" : "#ef4444",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)", transition: "all 0.3s ease",
          }}
        >
          {toast.msg}
        </div>
      )}

      <Nav />

      {/* HEADER & CONTENT */}
      <div className="max-w-1280 mx-auto px-[16px] md:px-[48px]">
        {/* PAGE HEADER */}
        <div className="pt-[32px] pb-[20px] mb-[24px] border-b border-[#e5ddd5] dark:border-[#1e1c19] transition-colors relative flex items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-[36px] h-[36px] shrink-0 rounded-full flex items-center justify-center bg-white dark:bg-[#1c1a17] border border-[#e5ddd5] dark:border-[#2a2825] transition-colors text-[#444] dark:text-[#aaa]"
          >
            <IoChevronBack size={20} />
          </button>
          <div>
            <h1 className="text-[24px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] leading-none transition-colors">Checkout</h1>
            <p className="text-[13px] text-[#666] mt-[4px] transition-colors">{cartitem?.length || 0} items in your order</p>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[24px]">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            
            {/* DELIVERY LOCATION CARD */}
            <div className="bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] rounded-[16px] p-[20px_24px] mb-[20px] transition-colors">
              <div className="flex items-center gap-[8px] mb-[12px]">
                <FaLocationDot className="text-[#e8650a] text-[16px]" />
                <h2 className="text-[16px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">Delivery Location</h2>
              </div>
              
              <div className="flex items-start justify-between mb-[12px]">
                {isEditingAddress ? (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search delivery address..."
                    value={currentaddress}
                    onChange={(e) => setcurrentaddress(e.target.value)}
                    onBlur={() => {
                      setIsEditingAddress(false);
                      if (currentaddress) getlatlngbyaddress();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsEditingAddress(false);
                        if (currentaddress) getlatlngbyaddress();
                      }
                    }}
                    className="w-full bg-transparent border-none border-b border-[#e8650a] text-[13px] text-[#1a1a1a] dark:text-[#ddd] outline-none pb-[4px] mr-[12px] transition-colors"
                  />
                ) : (
                  <p className="text-[13px] text-[#666] dark:text-[#aaa] transition-colors leading-[1.4] max-w-[80%]">
                    {address || "Enter your delivery address below"}
                  </p>
                )}
                <div className="flex gap-[12px] shrink-0">
                  <button onMouseDown={(e) => {
                    e.preventDefault();
                    if (isEditingAddress) {
                      setIsEditingAddress(false);
                      if (currentaddress) getlatlngbyaddress();
                    } else {
                      setIsEditingAddress(true);
                    }
                  }}>
                    <CiSearch className="text-[#666] text-[18px] cursor-pointer hover:text-[#e8650a] transition-colors" />
                  </button>
                  <button onClick={getCurrentPosition}>
                    <IoMdLocate className="text-[#666] text-[18px] cursor-pointer hover:text-[#e8650a] transition-colors" />
                  </button>
                </div>
              </div>

              <div className="mt-[12px] w-full rounded-[12px] overflow-hidden border border-[#e5ddd5] dark:border-[#1e1c19] h-[220px] transition-colors">
                {lat && lon ? (
                  <MapContainer center={[lat, lon]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap lat={lat} lon={lon} />
                    <Marker position={[lat, lon]} draggable eventHandlers={{ dragend: handledragend }}>
                      <Popup>Your delivery location</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[13px] bg-[#f5f0eb] dark:bg-[#1c1a17] text-[#666] transition-colors">
                    📍 Tap the locate icon to set your position
                  </div>
                )}
              </div>
            </div>

            {/* PAYMENT METHOD CARD */}
            <div className="bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] rounded-[16px] p-[20px_24px] mt-[20px] mb-[20px] transition-colors">
              <h2 className="text-[16px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] mb-[16px] transition-colors">Payment Method</h2>
              
              <div className="grid grid-cols-2 gap-[12px]">
                {/* COD */}
                <div
                  onClick={() => setpaymentmethod("cod")}
                  className={`flex flex-col items-center justify-center p-[16px] rounded-[12px] cursor-pointer text-center transition-colors ${
                    paymentmethod === "cod"
                      ? "bg-[#fff3eb] dark:bg-[#1a1208] border-[1.5px] border-[#e8650a]"
                      : "bg-[#f5f0eb] dark:bg-[#1c1a17] border-[0.5px] border-[#e5ddd5] dark:border-[#2a2825]"
                  }`}
                >
                  <MdElectricMoped className={`text-[24px] mb-[8px] transition-colors ${paymentmethod === "cod" ? "text-[#e8650a]" : "text-[#888]"}`} />
                  <span className={`text-[14px] font-medium mb-[4px] transition-colors ${paymentmethod === "cod" ? "text-[#e8650a]" : "text-[#1a1a1a] dark:text-[#ddd]"}`}>
                    Cash on Delivery
                  </span>
                  <span className="text-[12px] text-[#555] transition-colors">Pay at your door</span>
                </div>

                {/* ONLINE */}
                <div
                  onClick={() => setpaymentmethod("online")}
                  className={`flex flex-col items-center justify-center p-[16px] rounded-[12px] cursor-pointer text-center transition-colors ${
                    paymentmethod === "online"
                      ? "bg-[#fff3eb] dark:bg-[#1a1208] border-[1.5px] border-[#e8650a]"
                      : "bg-[#f5f0eb] dark:bg-[#1c1a17] border-[0.5px] border-[#e5ddd5] dark:border-[#2a2825]"
                  }`}
                >
                  <FaRegCreditCard className={`text-[24px] mb-[8px] transition-colors ${paymentmethod === "online" ? "text-[#e8650a]" : "text-[#888]"}`} />
                  <span className={`text-[14px] font-medium mb-[4px] transition-colors ${paymentmethod === "online" ? "text-[#e8650a]" : "text-[#1a1a1a] dark:text-[#ddd]"}`}>
                    UPI / Online
                  </span>
                  <span className="text-[12px] text-[#555] transition-colors">Powered by Razorpay</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="relative">
            <div className="sticky top-[24px] bg-white dark:bg-[#141210] border border-[#e5ddd5] dark:border-[#1e1c19] rounded-[16px] p-[24px] mt-[20px] transition-colors">
              <h2 className="text-[18px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] mb-[16px] pb-[16px] border-b border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                Order Summary
              </h2>

              <div className="flex flex-col">
                {cartitem?.length > 0 ? cartitem.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-[12px] border-b border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                    <div>
                      <p className="text-[14px] text-[#1a1a1a] dark:text-[#ddd] transition-colors">{item.name}</p>
                      <span className="text-[12px] text-[#555] block mt-[2px] transition-colors">x {item.quantity}</span>
                    </div>
                    <p className="text-[14px] font-medium text-[#e8650a]">₹{item.price * item.quantity}</p>
                  </div>
                )) : <p className="text-[13px] text-[#666] py-[10px]">No items in cart</p>}
              </div>

              <div className="flex flex-col mt-[8px]">
                <div className="flex justify-between py-[12px]">
                  <span className="text-[14px] text-[#666] transition-colors">Subtotal</span>
                  <span className="text-[14px] text-[#1a1a1a] dark:text-[#ddd] transition-colors">₹{totalamount}</span>
                </div>
                <div className="flex justify-between py-[10px]">
                  <span className="text-[14px] text-[#666] transition-colors">Delivery Fee</span>
                  <span className="text-[14px] text-[#1a1a1a] dark:text-[#ddd] transition-colors">
                    {deliveryfee === 0 ? "FREE" : `₹${deliveryfee}`}
                  </span>
                </div>
                
                <div className="flex justify-between mt-[12px] pt-[16px] border-t border-[#e5ddd5] dark:border-[#1e1c19] transition-colors">
                  <span className="text-[16px] font-semibold text-[#1a1a1a] dark:text-[#f0ece6] transition-colors">Total</span>
                  <span className="text-[20px] font-semibold text-[#e8650a]">₹{amount}</span>
                </div>
              </div>

              {/* PLACE ORDER BUTTON */}
              <button
                onClick={handleorder}
                disabled={loading}
                className="w-full mt-[20px] h-[52px] rounded-[12px] bg-[#e8650a] border-none text-[15px] font-semibold text-white cursor-pointer flex items-center justify-center gap-[8px] transition-all duration-200 hover:bg-[#cf5807]"
                style={{
                  background: loading ? "#cf5807" : "#e8650a",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Processing..." : (
                  <>
                    {paymentmethod === "cod" ? "Place Order" : "Pay & Order"}
                    <FaArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
