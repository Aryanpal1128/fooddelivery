import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import{ setCity,setState,setcaddress } from '../redux/userSlice'
import { setaddress, setlocation } from '../redux/mapslice'


const usegetcity = () => {
    const dispatch= useDispatch();
    const {userData}= useSelector((state)=>state.user)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
           dispatch(setlocation({lat:latitude,lon:longitude}))

            const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`);
            const data = await response.json();
         
            
            dispatch(setCity(data?.results?.[0]?.city || ""));
            dispatch(setState(data?.results?.[0]?.state || ""));

            const fullAddress = `${data?.results?.[0]?.address_line1 || ''}, ${data?.results?.[0]?.address_line2 || ''}`;
            dispatch(setcaddress(fullAddress));
            dispatch(setaddress(fullAddress ))


        })
 },[userData])


}
 
export default usegetcity
