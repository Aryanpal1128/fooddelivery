// src/hooks/usegetyshop.js
import { useEffect } from "react";
import axios from "axios";
import { serverurl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";

import { setiteminmycity} from "../redux/userSlice.js";

const usegetitembycity = () => {
  const dispatch = useDispatch();
  const {city}= useSelector(state=>state.user)

  useEffect(() => {
    const fetchshop = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/item/getitembycity/${city}`, {
          withCredentials: true,
        });

     

       
          dispatch(setiteminmycity(res.data));
          console.log("items by city",res.data)
       
      } catch (error) {
        console.error(" Error fetching shop:", error.message);
        dispatch(setiteminmycity(null));
      }
    };

    fetchshop();
  }, [city]);
};

export default usegetitembycity;
