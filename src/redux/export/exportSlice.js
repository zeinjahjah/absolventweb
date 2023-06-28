import { createSlice } from "@reduxjs/toolkit";
import {
   getCoordinatorTemeTable,
   getStudentsOfCoordinatorTable,
   getStudentsStatusTable,
   getTemeTable,
} from "./exportActions";

const initialState = {
   loading: false, // Checking if loading finish
   error: null, // Store Error msg get it from backend
   success: false, // Checking if auth is done
};

const exportSlice = createSlice({
   name: "export",
   initialState,
   reducers: {},
   extraReducers: {
      // Get Students - Coordonators - Teme Table
      [getTemeTable.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getTemeTable.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [getTemeTable.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
      // Get Students Status
      [getStudentsStatusTable.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getStudentsStatusTable.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [getStudentsStatusTable.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
      // Get All Students For Each Coordinator
      [getStudentsOfCoordinatorTable.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getStudentsOfCoordinatorTable.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [getStudentsOfCoordinatorTable.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
      // Get Coordonator With Subjects
      [getCoordinatorTemeTable.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getCoordinatorTemeTable.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [getCoordinatorTemeTable.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
   },
});

export const {} = exportSlice.actions;

export default exportSlice.reducer;
