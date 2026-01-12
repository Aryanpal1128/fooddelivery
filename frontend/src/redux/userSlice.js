import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    token: null,
    city:null,
    state:null,
    caddress:null,
    shopinmycity:null,
    iteminmycity :null,
    rating:null,
    cartitem:[],
   
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload.user;
      state.token = action.payload.token;
      
    },
    setCity: (state, action) => {
      state.city = action.payload;
     
      
    },
    setState: (state, action) => {
      state.state = action.payload;
     
      
    },
    setcaddress: (state, action) => {
      state.caddress = action.payload;
     
      
    },
    setshopinmycity: (state, action) => {
      state.shopinmycity = action.payload;
     
      
    },
    setiteminmycity: (state, action) => {
      state.iteminmycity = action.payload;
     
      
    },
    setrating: (state, action) => {
      state.iteminmycity = action.payload;
     
      
    },
    addtocart: (state, action) => {
      const cartitem = action.payload;
      const exisisting= state.cartitem.find(i=>i._id==cartitem.id)
      if(exisisting){
        exisisting.quantity+=cartitem.quantity

      }else{
        state.cartitem.push(cartitem)
      }
      state.totalamount=state.cartitem.reduce((sum,i)=>sum+i.price*i.quantity,0)
    console.log("cartitem",state.cartitem)
      
    },
    clearUserData: (state) => {
      state.userData = null;
      state.token = null;
       state.city = null;
    },
   updateCartQuantity: (state, action) => {
  
  const { _id, quantity } = action.payload;
  const existing = state.cartitem.find(i => i._id === _id);
  if (!existing) return;
 
  if (quantity <= 0) {
    state.cartitem = state.cartitem.filter(i => i._id !== _id);
  } else {
    existing.quantity = quantity;
  }
  state.totalamount=state.cartitem.reduce((sum,i)=>sum+i.price*i.quantity,0)
},

removeFromCart: (state, action) => {
 
  const id = action.payload;
  state.cartitem = state.cartitem.filter(i => i._id !== id);
},


  }
});

export const { setUserData, clearUserData,setCity,setState ,setcaddress, setshopinmycity, setiteminmycity,setrating,addtocart,updateCartQuantity,removeFromCart} = userSlice.actions;
export default userSlice.reducer;
