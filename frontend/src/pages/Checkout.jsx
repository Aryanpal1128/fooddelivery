import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { IoMdLocate } from "react-icons/io";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setaddress, setlocation } from '../redux/mapslice';
import axios from 'axios';
import { MdElectricMoped } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { serverurl } from '../App';

const RecenterMap = ({ lat, lon }) => {
  if (lat && lon) {
    const map = useMap();
    map.setView([lat, lon], 16, { animate: true });
  }
  return null;
};

function Checkout() {
  const { location, address } = useSelector((state) => state.map);
  const { cartitem, totalamount } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const [currentaddress, setcurrentaddress] = useState(address||"");
  const [paymentmethod, setpaymentmethod] = useState("");

  const deliveryfee = totalamount > 300 ? 0 : 50;
  const amount = totalamount + deliveryfee;
const lon = location.lon;
  const lat = location.lat;
 
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


  const handleorder = async () => {
   try {
     const result = await axios.post(`${serverurl}/api/order/placeorder`,
       {paymentmethod,
         address:{
           text:currentaddress,
           latitude:location.lat,
           longitude:location.lon,
         },
         totalamount,
         cartitem
 
 
 
       },{withCredentials:true})


       console.log("order",result)
   } catch (error) {
    console.log("handleorder",error)
   }


  }

  return (
    <div className="w-full p-5 flex flex-col gap-8">

      {/* HEADER */}
      <div className='flex place-items-center gap-2.5'>
       <IoChevronBack onClick={()=>navigate(-1)}/>
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
</div>
      {/* ADDRESS SECTION */}
      <section className="bg-white shadow-md p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <FaLocationDot className="text-orange-500 text-xl" />
          <h1 className="text-lg font-semibold">Delivery Location</h1>
        </div>

        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl">
          <input
            type="text"
            placeholder={address || "Enter your delivery address"}
            value={currentaddress}
            onChange={(e) => setcurrentaddress(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
          <CiSearch
            onClick={getlatlngbyaddress}
            className="text-gray-600 text-xl cursor-pointer mr-3"
          />
          <IoMdLocate
            onClick={getCurrentPosition}
            className="text-orange-500 text-2xl cursor-pointer"
          />
        </div>

        {/* MAP */}
        <div className="w-full h-[280px] rounded-xl overflow-hidden shadow-inner mt-4">
          {lat && lon ? (
            <MapContainer
              center={[lat, lon]}
              zoom={15}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap lat={lat} lon={lon} />
              <Marker
                position={[lat, lon]}
                draggable
                eventHandlers={{ dragend: handledragend }}
              >
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              Loading map…
            </div>
          )}
        </div>
      </section>

      {/* PAYMENT METHOD */}
      <section className="bg-white shadow-md p-5 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

        <div className="flex gap-4">

          {/* COD */}
          <div
            className={`w-40 h-24 flex flex-col items-center justify-center gap-1 text-center rounded-xl border cursor-pointer transition-all
              ${paymentmethod === "cod"
                ? "bg-amber-200 border-amber-500"
                : "bg-amber-100 border-gray-300"}`}
            onClick={() => setpaymentmethod("cod")}
          >
            <MdElectricMoped className="text-2xl text-orange-600" />
            <h1 className="font-semibold">Cash on Delivery</h1>
            <p className="text-xs text-gray-600">Pay at your door</p>
          </div>

          {/* ONLINE */}
          <div
            className={`w-40 h-24 flex flex-col items-center justify-center gap-1 text-center rounded-xl border cursor-pointer transition-all
              ${paymentmethod === "online"
                ? "bg-amber-200 border-amber-500"
                : "bg-amber-100 border-gray-300"}`}
            onClick={() => setpaymentmethod("online")}
          >
            <FaRegCreditCard className="text-2xl text-orange-600" />
            <h1 className="font-semibold">UPI / Online</h1>
            <p className="text-xs text-gray-600">Instant payment</p>
          </div>

        </div>
      </section>

      {/* ORDER SUMMARY */}
      <section className="bg-white shadow-md p-5 rounded-2xl">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>

        <div className="flex flex-col gap-3">

          {cartitem?.length > 0 ? (
            cartitem.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border-b"
              >
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-sm">x{item.quantity}</div>
                <div className="text-sm font-semibold text-gray-700">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No items in cart</div>
          )}

          <div className="flex justify-between pt-2">
            <h1 className="font-medium text-gray-700">Delivery Fee</h1>
            <h1 className="font-semibold">₹{deliveryfee}</h1>
          </div>

          <div className="flex justify-between text-lg font-bold mt-3">
            <h1>Total Amount</h1>
            <h1>₹{amount}</h1>
          </div>
        </div>
      </section>

      {/* BUTTON */}
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full py-3 rounded-xl shadow-md transition-all"
      onClick={handleorder}>
        {paymentmethod === "cod" ? "Place Order" : "Pay & Order"}
      </button>

    </div>
  );
}

export default Checkout;
