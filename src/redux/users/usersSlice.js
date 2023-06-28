import { createSlice } from "@reduxjs/toolkit";
import {
   getAcceptedStudent,
   getStudents,
   getStudentStatus,
} from "./uersAction";

const initialState = {
   loading: false, // Checking if loading finish
   error: null, // Store Error msg get it from backend
   success: false, // Checking if auth is done
   studentStatus: {}, // Status null => , 0 => Pending, 1 => Accepted, 2 => Finish, 3 => Rejected
   students: [], // Contain All Students With Thier Status, Tema, Coordonator
   acceptedStudent: [], // Contain All Accepted Student To Each Coordinator
   tempData: [], // Temporary To Save Data And Get It After Any Search
};

const usersSlice = createSlice({
   name: "users",
   initialState,
   reducers: {
      searchByName(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload) {
            state.students = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.students = JSON.parse(state.tempData);

         // Checking If Sting Contains # Or + To Escape With \
         if (payload.includes("+")) payload = payload.replace(/\+/g, `\\+`);
         else if (payload.includes("+"))
            payload = payload.replace(/\#/g, `\\#`);
         // Checking If String Contains Any Unexpected Char
         else if (payload.search(/[*&$^]/) !== -1) return;

         const regexp = new RegExp(`${payload}`, "i");

         state.students = state.students.filter((student) => {
            if (
               regexp.test(student.email) ||
               regexp.test(student?.coordonator?.email) ||
               regexp.test(student?.tema?.title)
            ) {
               student.email = student.email.replace(
                  regexp,
                  `<span class="search-result">${payload}</span>`
               );
               student.coordonator.email = student.coordonator.email.replace(
                  regexp,
                  `<span class="search-result">${payload}</span>`
               );
               student.tema.title = student.tema.title.replace(
                  regexp,
                  `<span class="search-result">${payload}</span>`
               );
               return true;
            }
         });
      },
      searchStudentPage(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload) {
            state.students = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.students = JSON.parse(state.tempData);

         // Checking If Sting Contains # Or + To Escape With \
         if (payload.includes("+")) payload = payload.replace(/\+/g, `\\+`);
         else if (payload.includes("+"))
            payload = payload.replace(/\#/g, `\\#`);
         // Checking If String Contains Any Unexpected Char
         else if (payload.search(/[*&$^]/) !== -1) return;

         const regexp = new RegExp(`${payload}`, "i");

         state.students = state.students.filter((student) => {
            if (
               regexp.test(student?.email) ||
               regexp.test(student?.student_name) ||
               regexp.test(student?.specializare)
            ) {
               student.email = student.email.replace(
                  regexp,
                  `<span class="search-result">${payload}</span>`
               );
               student.student_name = student.student_name.replace(
                  regexp,
                  `<span class="search-result">${payload}</span>`
               );
               student.specializare = student.specializare.replace(
                  regexp,
                  `<span class="search-result">${payload}</span>`
               );
               return true;
            }
         });
      },
      searchTipTema(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload || payload === "All") {
            state.students = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.students = JSON.parse(state.tempData);
         const regexp = new RegExp(`${payload}`, "i");

         state.students = state.students.filter((student) =>
            regexp.test(student?.tema?.title)
         );
      },
      searchCoordinators(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload) {
            state.acceptedStudent = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.acceptedStudent = JSON.parse(state.tempData);

         // Checking If Sting Contains # Or + To Escape With \
         if (payload.includes("+")) payload = payload.replace(/\+/g, `\\+`);
         else if (payload.includes("+"))
            payload = payload.replace(/\#/g, `\\#`);
         // Checking If String Contains Any Unexpected Char
         else if (payload.search(/[*&$^]/) !== -1) return;
         const regexp = new RegExp(`${payload}`, "i");

         state.acceptedStudent = state.acceptedStudent.filter((coordinator) =>
            regexp.test(coordinator.name)
         );
      },
      searchStudent(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload) {
            state.acceptedStudent = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.acceptedStudent = JSON.parse(state.tempData);
         // Checking If Sting Contains # Or + To Escape With \
         if (payload.includes("+")) payload = payload.replace(/\+/g, `\\+`);
         else if (payload.includes("+"))
            payload = payload.replace(/\#/g, `\\#`);
         // Checking If String Contains Any Unexpected Char
         else if (payload.search(/[*&$^]/) !== -1) return;

         const regexp = new RegExp(`${payload}`, "i");

         state.acceptedStudent = state.acceptedStudent.filter((coordinator) => {
            coordinator.students = coordinator.students.filter((student) =>
               regexp.test(student?.name)
            );
            return coordinator.students.length > 0;
         });
      },
      searchTema(state, { payload }) {
         // When Input Is Empty Reset Data
         if (!payload) {
            state.acceptedStudent = JSON.parse(state.tempData);
            return;
         }
         // When User Enter Any Thing Reset Data To Re-search
         state.acceptedStudent = JSON.parse(state.tempData);
         // Checking If Sting Contains # Or + To Escape With \
         if (payload.includes("+")) payload = payload.replace(/\+/g, `\\+`);
         else if (payload.includes("+"))
            payload = payload.replace(/\#/g, `\\#`);
         // Checking If String Contains Any Unexpected Char
         else if (payload.search(/[*&$^]/) !== -1) return;

         const regexp = new RegExp(`${payload}`, "i");

         state.acceptedStudent = state.acceptedStudent.filter((coordinator) => {
            coordinator.students = coordinator.students.filter((student) =>
               regexp.test(student?.tema)
            );
            return coordinator.students.length > 0;
         });
      },
   },
   extraReducers: {
      // Get Student Status
      [getStudentStatus.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getStudentStatus.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.studentStatus = payload.data;
         // Store Student Status inside localStorage
         localStorage.setItem(
            "studentStatus",
            JSON.stringify(state.studentStatus)
         );
      },
      [getStudentStatus.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Get Student Status
      [getStudents.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getStudents.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.students = payload.data;
         // Save Data In Temporary Variable To  Get It After Any Search
         state.tempData = JSON.stringify(state.students);
      },
      [getStudents.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },

      // Get Accepted Students For Each Coordonator
      [getAcceptedStudent.pending]: (state) => {
         state.loading = true;
         state.success = false; // Reset a value every Request
         state.error = null; // Reset a value every Request
      },
      [getAcceptedStudent.fulfilled]: (state, { payload }) => {
         state.loading = false;
         state.success = true;
         state.acceptedStudent = payload.data;
         // Remove Doctocs Don't Have Student
         state.acceptedStudent = state.acceptedStudent.filter(
            (doctor) => doctor.students.length > 0
         );
         // Save Data In Temporary Variable To  Get It After Any Search
         state.tempData = JSON.stringify(state.acceptedStudent);
      },
      [getAcceptedStudent.rejected]: (state, { payload }) => {
         state.loading = false;
         state.error = payload;
      },
   },
});

export const {
   searchByName,
   searchTipTema,
   searchCoordinators,
   searchStudent,
   searchTema,
   searchStudentPage,
} = usersSlice.actions;

export default usersSlice.reducer;
