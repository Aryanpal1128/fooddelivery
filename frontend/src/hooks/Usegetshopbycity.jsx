// src/hooks/usegetyshop.js
import { useEffect } from "react";
import axios from "axios";
import { serverurl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";

import {setshopinmycity} from "../redux/userSlice.js";

const usegetshopbycity = () => {
  const dispatch = useDispatch();
  const {city}= useSelector(state=>state.user)

  useEffect(() => {
    const fetchshop = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/shop/getbycity/${city}`, {
          withCredentials: true,
        });

     

       
          dispatch(setshopinmycity(res.data));
          console.log(res.data)
       
      } catch (error) {
        console.error(" Error fetching shop:", error.message);
        dispatch(setshopinmycity(null));
      }
    };

    fetchshop();
  }, [city]);
};

export default usegetshopbycity;
