import { createSlice } from "@reduxjs/toolkit";
import {
   addNewTopic,
   deleteTopic,
   editeTopic,
   getTopicsByDoctorId,
   getAllTopicsByDoctor,
} from "./topicsActions";

const initialState = {
   loading: false, // Checking if loading finish
   error: null, // Store Error msg get it from backend
   success: false, // Checking if auth is done
   topicsByDoctor: [], // All Teme Sorted By Doctor
   tempData: "[]", // Temporary To Save Data And Get It After Any Search
};

const topicsSlice = createSlice({
   name: "topics",
   initialState,
   reducers: {
      searchGlobaly(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload || payload === "Toate") {
            state.topicsByDoctor = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.topicsByDoctor = JSON.parse(state.tempData);

         // Checking If Sting Contains # Or + To Escape With \
         if (payload.includes("+")) payload = payload.replace(/\+/g, `\\+`);
         else if (payload.includes("+"))
            payload = payload.replace(/\#/g, `\\#`);
         // Checking If String Contains Any Unexpected Char
         else if (payload.search(/[*&$^]/) !== -1) return;

         const regexp = new RegExp(`${payload}`, "i");

         state.topicsByDoctor = state.topicsByDoctor.filter((doctor) => {
            doctor.teme = doctor.teme.filter((tema) => {
               if (
                  regexp.test(tema?.title) ||
                  regexp.test(tema?.detalii) ||
                  regexp.test(tema?.tema_type)
               ) {
                  tema.title = tema.title.replace(
                     regexp,
                     `<span class="search-result">${payload}</span>`
                  );
                  tema.detalii = tema.detalii.replace(
                     regexp,
                     `<span class="search-result">${payload}</span>`
                  );
                  return true;
               } else if (regexp.test(tema?.tema_type)) return true;
            });
            return doctor.teme.length > 0;
         });
      },
      searchByCoordinator(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload) {
            state.topicsByDoctor = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.topicsByDoctor = JSON.parse(state.tempData);
         const regexp = new RegExp(`${payload}`, "i");

         state.topicsByDoctor = state.topicsByDoctor.filter((doctor) =>
            regexp.test(doctor?.email)
         );
      },
      searchByProgrammingLang(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload || payload === "Toate") {
            state.topicsByDoctor = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.topicsByDoctor = JSON.parse(state.tempData);
         // Checking Of Sting Containe # Or + To Escape With \
         if (payload.includes("+")) payload = payload.replace(/\+/g, `\\+`);
         else if (payload.includes("#"))
            payload = payload.replace(/\#/g, `\\#`);

         let regexp = new RegExp(`${payload}`, "i");
         if (payload === "C")
            regexp = new RegExp(`\\b${payload}\\b(?![\\+\\#])`, "i");
         else if (payload === "Java")
            regexp = new RegExp(`\\b${payload}\\b`, "i");

         state.topicsByDoctor = state.topicsByDoctor.filter((doctor) => {
            doctor.teme = doctor.teme.filter(
               (tema) =>
                  regexp.test(tema?.title) ||
                  regexp.test(tema?.detalii) ||
                  regexp.test(tema?.tema_type)
            );
            return doctor.teme.length > 0;
         });
      },
   },
   extraReducers: {
      // Getting All Teme By Doctor
      [getAllTopicsByDoctor.pending]: (state) => {
         state.loading = true;
         state.success = false;
         state.error = null;
      },
      [getAllTopicsByDoctor.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.topicsByDoctor = payload.data;

         // remove tema if it is taken
         state.topicsByDoctor = state.topicsByDoctor.filter((doctor) => {
            // Remove Taken Tema Form List Of Topic
            // doctor.teme = doctor.teme.filter((tema) => tema.is_taken === 0);

            // Sorting Teme By Teme's updated time
            doctor.teme.sort((a, b) => {
               const firEleDate = new Date(a["updated_at"]);
               const secEleDate = new Date(b["updated_at"]);
               return +secEleDate - +firEleDate;
            });
            return doctor.teme.length > 0;
         });
         // Save Data In Temporary Variable To  Get It After Any Search
         state.tempData = JSON.stringify(state.topicsByDoctor);
      },
      [getAllTopicsByDoctor.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Getting doctor's topics
      [getTopicsByDoctorId.pending]: (state) => {
         state.loading = true;
         state.success = false;
         state.error = null;
      },
      [getTopicsByDoctorId.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.topicsByDoctor = [payload.data];
         // Sorting Teme By teme's updated time
         state.topicsByDoctor[0].teme.sort((a, b) => {
            const firEleDate = new Date(a["updated_at"]);
            const secEleDate = new Date(b["updated_at"]);
            return +secEleDate - +firEleDate;
         });
         // Save Data In Temporary Variable To  Get It After Any Search
         state.tempData = JSON.stringify(state.topicsByDoctor);
      },
      [getTopicsByDoctorId.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Adding a new topic
      [addNewTopic.pending]: (state) => {
         state.loading = true;
         state.success = false;
         state.error = null;
      },
      [addNewTopic.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [addNewTopic.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Edation topic
      [editeTopic.pending]: (state) => {
         state.loading = true;
         state.success = false;
         state.error = null;
      },
      [editeTopic.fulfilled]: (state) => {
         state.loading = false;
         state.success = true;
      },
      [editeTopic.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Deletion the topic
      [deleteTopic.pending]: (state) => {
         state.loading = true;
         state.success = false;
         state.error = null;
      },
      [deleteTopic.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         // Remove The Tema From Topics
         state.topicsByDoctor[0].teme = state.topicsByDoctor[0].teme.filter(
            (tema) => tema.id !== payload
         );
      },
      [deleteTopic.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
   },
});

export const { searchGlobaly, searchByCoordinator, searchByProgrammingLang } =
   topicsSlice.actions;

export default topicsSlice.reducer;
