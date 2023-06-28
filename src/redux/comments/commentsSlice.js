import { createSlice } from "@reduxjs/toolkit";
import {
   addComment,
   getComments,
   deleteComment,
   editeComment,
} from "./commentsAction";

const initialState = {
   loading: false, // Checking if loading finish
   error: null, // Store Error msg get it from backend
   success: false, // Checking if auth is done
   comments: [], // All comment in exactly post Event
};

const commentsSlice = createSlice({
   name: "comments",
   initialState,
   reducers: {},
   extraReducers: {
      // Get Comments By Event Id
      [getComments.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getComments.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.comments = payload.data;
      },
      [getComments.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Add New Comment
      [addComment.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [addComment.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [addComment.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Edite Comment
      [editeComment.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [editeComment.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [editeComment.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Delete Comment
      [deleteComment.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [deleteComment.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         // Remove Deleted Comment From Comments
         state.comments = state.comments.filter(
            (comment) => comment.id !== payload
         );
      },
      [deleteComment.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
   },
});

export const {} = commentsSlice.actions;

export default commentsSlice.reducer;
