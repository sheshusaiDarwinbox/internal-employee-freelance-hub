// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import forgotPasswordReducer from "./slices/forgotPasswordSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    forgotPassword:forgotPasswordReducer
  },
});

export default store;
