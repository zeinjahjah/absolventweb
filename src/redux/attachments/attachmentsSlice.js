import { createSlice } from "@reduxjs/toolkit";
import { getFile, uploadeFile } from "./attachmentsActions";

const initialState = {
   loading: false, // Checking if loading finish
   error: null, // Store Error msg get it from backend
   success: false, // Checking if auth is done
};

const attachmentsSlice = createSlice({
   name: "attachments",
   initialState,
   reducers: {},
   extraReducers: {
      // Uploade File
      [uploadeFile.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [uploadeFile.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
      },
      [uploadeFile.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Getting File
      [getFile.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getFile.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
      },
      [getFile.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
   },
});

export const {} = attachmentsSlice.actions;

export default attachmentsSlice.reducer;
