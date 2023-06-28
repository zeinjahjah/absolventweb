import { createSlice } from "@reduxjs/toolkit";
import { registerUser, userLogin, userLogout } from "./authActions";

// initialize userToken from local storage
const userToken = localStorage.getItem("userToken")
   ? localStorage.getItem("userToken")
   : null;

const initialState = {
   loading: false, // Checking if loading finish
   userInfo: null, // Store response
   userToken, // Store Token
   error: null, // Store Error msg get it from backend
   success: false, // Checking if auth is done
   isLoggingOut: false,
};

const authSlice = createSlice({
   name: "user",
   initialState,
   reducers: {},
   extraReducers: {
      // login user
      [userLogin.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [userLogin.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.userInfo = payload;
         state.userToken = payload.token;
         state.success = true;
      },
      [userLogin.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // register user
      [registerUser.pending]: (state) => {
         state.loading = true;
         state.success = false;
         state.error = null;
      },
      [registerUser.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.userInfo = payload;
         state.userToken = payload.token;
         state.success = true;
      },
      [registerUser.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Logout user
      [userLogout.pending]: (state) => {
         state.loading = true;
         state.success = false;
         state.error = null;
      },
      [userLogout.fulfilled]: (state) => {
         state.loading = false;
         state.userToken = null;
         state.isLoggingOut = true;
      },
   },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
