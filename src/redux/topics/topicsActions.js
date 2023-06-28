import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Getting All Teme By Doctor
export const getAllTopicsByDoctor = createAsyncThunk(
   "topics/getAllTopicsByDoctor",
   async (_, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         const { data } = await axios.get(
            `/api/coordinators-with-subjects`,
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

// Getting doctor's topics
export const getTopicsByDoctorId = createAsyncThunk(
   "topics/getTopicsByDoctorId",
   async (doctorId, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };
         const { data } = await axios.get(
            `/api/teme/coordonator/${doctorId}`,
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

// Adding a new topic
export const addNewTopic = createAsyncThunk(
   "topics/addNewTopic",
   async (topic, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
               "Content-Type": "application/json",
            },
         };

         const { data } = await axios.post(`/api/teme`, topic, config);
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

// Edation a topic
export const editeTopic = createAsyncThunk(
   "topics/editeTopic",
   async ({ topicId, topic }, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
               "Content-Type": "application/json",
            },
         };

         const { data } = await axios.put(
            `/api/teme/${topicId}`,
            topic,
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

// Deletion a topic
export const deleteTopic = createAsyncThunk(
   "topics/deleteTopic",
   async (topicId, { rejectWithValue }) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
         };

         await axios.delete(`/api/teme/${topicId}`, config);
         return topicId;
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
