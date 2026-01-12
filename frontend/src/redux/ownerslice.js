import { createSlice } from '@reduxjs/toolkit';

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    shopData: null,
   shopitem: null,
  
    
  },
  reducers: {
    setshopData: (state, action) => {
      state.shopData = action.payload;
    
      
    },
    setitem: (state, action) => {
      state.shopitem = action.payload;
     
      
    }
  }
});

export const { setshopData, setitem } = ownerSlice.actions;
export default ownerSlice.reducer;
