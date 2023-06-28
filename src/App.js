// Css File
import "./assets/css/style.css";
// External
import { Outlet, Route, Routes } from "react-router-dom";
// Auth Pages
import Login from "./auth/Login";
import Register from "./auth/Register";
// Pages
import {
   Greeting,
   HomePage,
   ListOfTopics,
   Students,
   Workspace,
   Support,
   Profile,
   AddNewTopic,
   EditeTopic,
   AddMeeting,
   AddPost,
   AddTask,
   EditePost,
   EditeMeeting,
   EditeTask,
   Post,
   Task,
   Doctors,
   PageNotFound,
} from "./pages";

function App() {
   return (
      <>
         <Routes>
            <Route index element={<Greeting />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/list-of-topics" element={<ListOfTopics />} />
            <Route path="/workspace" element={<Outlet />}>
               <Route index element={<Workspace />} />
               <Route path="add-post" element={<AddPost />} />
               <Route path="edite-post" element={<EditePost />} />
               <Route path="add-task" element={<AddTask />} />
               <Route path="edite-task" element={<EditeTask />} />
               <Route path="add-meeting" element={<AddMeeting />} />
               <Route path="edite-meeting" element={<EditeMeeting />} />
               <Route path="post" element={<Post />} />
               <Route path="task" element={<Task />} />
            </Route>
            <Route path="/profile" element={<Outlet />}>
               <Route index element={<Profile />} />
               <Route path="add-new-topic" element={<AddNewTopic />} />
               <Route path="edite-topic" element={<EditeTopic />} />
            </Route>
            <Route path="/students" element={<Students />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<PageNotFound />} />
         </Routes>
      </>
   );
}

export default App;
