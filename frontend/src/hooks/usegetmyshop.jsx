// src/hooks/usegetyshop.js
import { useEffect } from "react";
import axios from "axios";
import { serverurl } from "../App.jsx";
import { useDispatch } from "react-redux";
import { setshopData } from "../redux/ownerslice.js";

const usegetmyshop = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchshop = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/shop/getmyshop`, {
          withCredentials: true,
        });

     

        if (res.data) {
          dispatch(setshopData(res.data));
        } else {
          dispatch(setshopData(null));
        }
      } catch (error) {
        console.error("Error fetching shop:", error.message);
        dispatch(setshopData(null));
      }
    };

    fetchshop();
  }, [dispatch]);
};

export default usegetmyshop;
