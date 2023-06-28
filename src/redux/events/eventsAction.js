import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Get All Coordonator's Events => For Coordiator Homepage
export const getAllCoordinatorEvent = createAsyncThunk(
   "events/getAllCoordinatorEvent",
   async (_, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(
            `/api/event/coordinator/homepage`,
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

// Get All Student Events => For Coordonator By Student_ID
export const getWorkspaceEvents = createAsyncThunk(
   "events/getWorkspaceEvents",
   async (studentId, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(
            `/api/event/student/${studentId}`,
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

// Get Student's Events
export const getStudentEvents = createAsyncThunk(
   "events/getStudentEvents",
   async (_, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(`/api/event`, config);
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

// Get Event By Id
export const getEventById = createAsyncThunk(
   "events/getEventById",
   async (eventId, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(`/api/event/${eventId}`, config);
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

// Add A New Event
export const addNewEvent = createAsyncThunk(
   "events/addNewEvent",
   async (eventInfo, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
               "Content-Type": "application/json",
            },
         };

         const { data } = await axios.post(`/api/event`, eventInfo, config);
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

// Edite An Event
export const editeEvent = createAsyncThunk(
   "events/editeEvent",
   async ({ eventID, eventContent }, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
               "Content-Type": "application/json",
            },
         };
         const { data } = await axios.put(
            `/api/event/${eventID}`,
            eventContent,
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

// Delete An Event
export const deleteEvent = createAsyncThunk(
   "events/deleteEvent",
   async (eventID, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };
         await axios.delete(`/api/event/${eventID}`, config);
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
