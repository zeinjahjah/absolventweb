import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const userLogin = createAsyncThunk(
   "user/login",
   async ({ email, password }, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               "Content-Type": "application/json",
            },
         };

         const { data } = await axios.post(
            `/api/login`,
            { email, password },
            config
         );

         // store user in local storage
         localStorage.setItem("userToken", data.token);
         localStorage.setItem("user", JSON.stringify(data));
         return data;
      } catch (error) {
         // return custom error message from API if any
         if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
         } else {
            return rejectWithValue(error.message);
         }
      }
   }
);

export const registerUser = createAsyncThunk(
   "api/register",
   async (userRegInfo, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               "Content-Type": "application/json",
            },
         };

         const { data } = await axios.post(
            `/api/register`,
            userRegInfo,
            config
         );

         // store user's token in local storage
         localStorage.setItem("userToken", data.token);
         // store user in local storage
         localStorage.setItem("user", JSON.stringify(data));
         return data;
      } catch (error) {
         if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
         } else {
            return rejectWithValue(error.message);
         }
      }
   }
);
export const userLogout = createAsyncThunk(
   "user/logout",
   async (_, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };
         const { data } = await axios.get(`/api/logout`, config);
         localStorage.clear();
         return data;
      } catch (error) {
         // return custom error message from API if any
         if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
         } else {
            return rejectWithValue(error.message);
         }
      }
   }
);
