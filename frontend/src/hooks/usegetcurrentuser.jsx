import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverurl } from '../App.jsx'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'



const usegetcurrentuser = () => {
  const [user, setUser] = useState(null)
 const dispatch= useDispatch();
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/user/current`, { withCredentials: true });
      setUser(res.data.user) 
      dispatch(setUserData(res.data))
        console.log("current user", res)
        
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }

    fetchuser()
  }, [])

  return user
}

export default usegetcurrentuser
