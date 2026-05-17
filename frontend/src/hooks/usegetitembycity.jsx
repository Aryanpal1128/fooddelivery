// src/hooks/usegetyshop.js
import { useEffect } from "react";
import axios from "axios";
import { serverurl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";

import { setiteminmycity} from "../redux/userSlice.js";

const usegetitembycity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector(state => state.user);
  const activeCity = city && city !== "null" && city !== "undefined" && city.trim() !== "" ? city : "Delhi";

  useEffect(() => {
    const fetchshop = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/item/getitembycity/${activeCity}`, {
          withCredentials: true,
        });
        dispatch(setiteminmycity(res.data));
        console.log("items by city", res.data);
      } catch (error) {
        console.error(" Error fetching items detailed:", error.response?.data?.message || error.message);
        dispatch(setiteminmycity([]));
      }
    };

    fetchshop();
  }, [activeCity]);
};

export default usegetitembycity;
