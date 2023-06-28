import { createSlice } from "@reduxjs/toolkit";
import {
   addNewEvent,
   deleteEvent,
   editeEvent,
   getAllCoordinatorEvent,
   getEventById,
   getStudentEvents,
   getWorkspaceEvents,
} from "./eventsAction";

const initialState = {
   loading: false, // Checking if loading finish
   error: null, // Store Error msg get it from backend
   success: false, // Checking if auth is done
   workspaceEvents: [], // All workspace Events
   eventById: [], // Exactly Event By Its Id
   coordinatorEvents: [], // All Coordonator's Events
};

const eventsSlice = createSlice({
   name: "events",
   initialState,
   reducers: {},
   extraReducers: {
      // Get All Coordonator's Events
      [getAllCoordinatorEvent.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getAllCoordinatorEvent.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.coordinatorEvents = payload.data;
      },
      [getAllCoordinatorEvent.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Get Doctor's Workspace Events To Specific Student
      [getWorkspaceEvents.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getWorkspaceEvents.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.workspaceEvents = payload.workspace_info.events;

         // Sorting Events by last update
         state.workspaceEvents.sort((a, b) => {
            const firEleDate = new Date(a["updated_at"]);
            const secEleDate = new Date(b["updated_at"]);
            return +secEleDate - +firEleDate;
         });
      },
      [getWorkspaceEvents.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Get Student's Events
      [getStudentEvents.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getStudentEvents.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         // Workspace Information
         const workspaceInfo = {
            coordinator_name:
               payload.workspace_info["coordonator_name"] || null,
            workspace_id: payload.workspace_info.workspace_id || null,
            tema_name: payload.workspace_info["tema_title"] || null,
         };
         // Store Workspace Information Inside LocalStorage
         localStorage.setItem("workspaceInfo", JSON.stringify(workspaceInfo));
         state.workspaceEvents = payload.workspace_info.events;
         // Sorting Events by last update
         state.workspaceEvents.sort((a, b) => {
            const firEleDate = new Date(a["updated_at"]);
            const secEleDate = new Date(b["updated_at"]);
            return +secEleDate - +firEleDate;
         });
      },
      [getStudentEvents.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Get Event By Id
      [getEventById.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getEventById.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.eventById = payload.data;
      },
      [getEventById.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Add A New Event
      [addNewEvent.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [addNewEvent.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [addNewEvent.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Edite An Event
      [editeEvent.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [editeEvent.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [editeEvent.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Delete An Event
      [deleteEvent.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [deleteEvent.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
      },
      [deleteEvent.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
   },
});

export const {} = eventsSlice.actions;

export default eventsSlice.reducer;
