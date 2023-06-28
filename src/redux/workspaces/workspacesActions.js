import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Create New Workspace
export const createWorkspace = createAsyncThunk(
   "workspaces/createWorkspace",
   async (workspaceInfo, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
               "Content-Type": "application/json",
            },
         };

         const { data } = await axios.post(
            `/api/workspace`,
            workspaceInfo,
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

// Change Workspace Status
export const changeWorkspaceStatus = createAsyncThunk(
   "workspaces/changeWorkspaceStatus",
   async ([status, workspaceId], { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
               "Content-Type": "application/json",
            },
         };

         const { data } = await axios.put(
            `/api/workspace/${workspaceId}`,
            status,
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

// Delete Exist Workspace
export const deleteWorkspace = createAsyncThunk(
   "workspaces/deleteWorkspace",
   async (workspaceId, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.delete(
            `/api/workspace/${workspaceId}`,
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

// Get Workspace that 0 Status
export const getWaitingWorkspace = createAsyncThunk(
   "workspaces/getWaitingWorkspace",
   async (_, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(
            `/api/coordinators-workspaces/0`,
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

// Get Workspace that 1 Status
export const getAcceptedWorkspace = createAsyncThunk(
   "workspaces/getAcceptedWorkspace",
   async (_, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(
            `/api/coordinators-workspaces/1`,
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
