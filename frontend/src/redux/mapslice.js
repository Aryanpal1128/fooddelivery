import { createSlice } from '@reduxjs/toolkit';
const mapSlice = createSlice({
  name: "map",
  initialState:{
    location:{
        lat:null,
        lon:null,
    },
    address:null,
    

  },
 
 
  reducers: {
     setlocation:(state,action)=>{
        const{lat,lon}= action.payload
        state.location.lat=lat
        state.location.lon=lon
     },
     setaddress:(state,action)=>{
        state.address=action.payload
     }

  }
});

export const {setaddress,setlocation } = mapSlice.actions;
export default mapSlice.reducer;
