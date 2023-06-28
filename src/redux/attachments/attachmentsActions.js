import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Uploade File
export const uploadeFile = createAsyncThunk(
   "attachments/UploadeFile",
   async (fileInfo, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
               "Content-Type": "multipart/form-data",
            },
         };

         const { data } = await axios.post(
            `/api/upload-file`,
            fileInfo,
            config
         );
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

// Getting File
export const getFile = createAsyncThunk(
   "attachments/getFile",
   async (eventId, { rejectWithValue }) => {
      try {
         const config = {
            responseType: "arraybuffer",
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(`/api/get-file/${eventId}`, config);
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

// Remove File
export const removeFile = createAsyncThunk(
   "attachments/removeFile",
   async (fileId, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(`/api/remove-file/${fileId}`, config);
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
