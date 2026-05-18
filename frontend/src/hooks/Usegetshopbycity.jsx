// src/hooks/usegetyshop.js
import { useEffect } from "react";
import axios from "axios";
import { serverurl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";

import {setshopinmycity} from "../redux/userSlice.js";

const usegetshopbycity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector(state => state.user);
  
  // Normalize: Trim whitespace and default to Greater Noida
  const activeCity = city && city !== "null" && city !== "undefined" && city.trim() !== "" 
    ? city.trim() 
    : "Greater Noida";

  useEffect(() => {
    const fetchshop = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/shop/getbycity/${activeCity}`, {
          withCredentials: true,
        });
        dispatch(setshopinmycity(res.data));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Expected when a city has no shops
          dispatch(setshopinmycity([]));
        } else {
          console.error("Error fetching shops by city:", error.response?.data?.message || error.message);
          dispatch(setshopinmycity([]));
        }
      }
    };

    fetchshop();
  }, [activeCity, dispatch]);
};

export default usegetshopbycity;
