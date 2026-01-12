
import userSlice from "./userSlice";
import ownerSlice from "./ownerslice";
import mapSlice from "./mapslice"

import {configureStore}from '@reduxjs/toolkit';



const store = configureStore({
    reducer:{
        user: userSlice,
        owner: ownerSlice,
        map : mapSlice,
    }
})

export default store;