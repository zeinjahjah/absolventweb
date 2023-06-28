import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   workspaceInfo: { tema_id: null, coordonator_id: null }, // Store Creation Workpace Info
   searchMode: false, // To Determine If Shoud Reset Pagination To Start Point
   searchMethod: "", // Specify The Serach Method
   btnProcess: {
      deleteTema: false,
      acceptStudent: false,
      rejectStudent: false,
   }, // To Prevent Show Alert Unless Operation Is Success Or Rejected
};

const globalSlice = createSlice({
   name: "global",
   initialState,
   reducers: {
      setWorkspaceInfo(state, { payload }) {
         state.workspaceInfo.tema_id = payload.tema_id;
         state.workspaceInfo.coordonator_id = payload.coordonator_id;
      },
      setSearchMode(state, { payload }) {
         state.searchMode = payload;
      },
      setSearchMethod(state, { payload }) {
         state.searchMethod = payload;
      },
      seBtnProcess(state, { payload }) {
         state.btnProcess = { ...state.btnProcess, ...payload };
      },
   },
   extraReducers: {},
});

export const {
   setWorkspaceInfo,
   setSearchMode,
   setSearchMethod,
   seBtnProcess,
} = globalSlice.actions;

export default globalSlice.reducer;
