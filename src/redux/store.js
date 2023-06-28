// External
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
// Internal
import attachmentsSlice from "./attachments/attachmentsSlice";
import authSlice from "./auth/authSlice";
import commentsSlice from "./comments/commentsSlice";
import eventsSlice from "./events/eventsSlice";
import exportSlice from "./export/exportSlice";
import globalSlice from "./global/globalSlice";
import topicsSlice from "./topics/topicsSlice";
import usersSlice from "./users/usersSlice";
import workspacesSlice from "./workspaces/workspacesSlice";

const store = configureStore({
   reducer: {
      auth: authSlice,
      topics: topicsSlice,
      workspaces: workspacesSlice,
      events: eventsSlice,
      comments: commentsSlice,
      users: usersSlice,
      attachments: attachmentsSlice,
      global: globalSlice,
      export: exportSlice,
   },
   // Prevent serializableCheck Checking
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
   // Disable Redux DevTools
   devTools: false,
});

export default store;
