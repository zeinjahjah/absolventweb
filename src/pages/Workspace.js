// External
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
// Internal
import Header from "../components/Header";
import UniversityLogo from "../components/UniversityLogo";
import addIcon from "../assets/imgs/icons/addIcon.png";
import {
   getStudentEvents,
   getWorkspaceEvents,
} from "../redux/events/eventsAction";
import { getStudentStatus } from "../redux/users/uersAction";
import {
   changeWorkspaceStatus,
   deleteWorkspace,
} from "../redux/workspaces/workspacesActions";
import Table from "../components/Table";

const Workspace = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   const workspaceInfo = JSON.parse(localStorage.getItem("workspaceInfo"));
   const studentStatus = JSON.parse(localStorage.getItem("studentStatus"));

   document.title = "Absolventweb | Workspace";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const workspaceEvents = useSelector((state) => state.events.workspaceEvents);

   // ======================= Router Hook =======================
   const navigate = useNavigate();

   // ======================= Sweet Alert Labrary =======================
   // Check Box To Confirm Process
   const confirmProcess = async (type, info, msg) => {
      let checkBox = await swal(msg, {
         dangerMode: true,
         buttons: true,
      });
      if (type === "delete-workspace" && checkBox) {
         dispatch(deleteWorkspace(info));
         localStorage.removeItem("workspaceInfo");
         navigate("/students");
      } else if (type === "finish-workspace" && checkBox) {
         dispatch(changeWorkspaceStatus(info));
         localStorage.removeItem("workspaceInfo");
         navigate("/students");
      }
   };

   // ======================= React Hook =======================
   useEffect(() => {
      if (userType === "coordonator" && workspaceInfo?.student_id) {
         dispatch(getWorkspaceEvents(workspaceInfo.student_id));
      }
      if (userType === "student") {
         dispatch(getStudentStatus());
         // Get Events Only For Students Have Status 1
         if (studentStatus?.workspace_status === 1)
            dispatch(getStudentEvents());
      }
   }, []);

   // ======================= Own Function =======================
   /**
    * Use This Function To Get Pagination Value From Each Table And Reset It Based On Search Mode
    * @param Function UseState Fuction That Contain Pagination Values
    * @returns Undefined
    */
   const resetPagination = (resetFuc) => {
      resetFuc({
         start: 0,
         end: 3,
      });
   };

   if (user) {
      // Names Of Table Columns
      const tableCols = [
         { heading: "Author", val: "author_type" },
         { heading: "Titlu", val: "title", process: { link: true } },
         { heading: "Type", val: "type" },
         { heading: "Deadline", val: "due_date" },
         {
            heading: "Attachment",
            val: "attachment",
            process: { file: true },
         },
      ];
      if (userType === "student") {
         // Status 1 => Access to Workspace page
         if (studentStatus?.workspace_status === 1) {
            return (
               <>
                  <Header userType={userType} />
                  <main className="main workspace-page">
                     <div className="container">
                        <div className="content">
                           <ul className="workspace-info">
                              <li className="item">
                                 Titlul: {workspaceInfo?.tema_name || ""}
                              </li>
                              <li className="item">
                                 Coordonator:{" "}
                                 {workspaceInfo?.coordinator_name || ""}
                              </li>
                              <li className="item">
                                 Student: {JSON.parse(user)?.name}
                              </li>
                           </ul>
                           <div className="workspace-btns">
                              <button
                                 className="btn post-btn"
                                 onClick={() => {
                                    navigate("add-post");
                                 }}
                              >
                                 Post
                                 <img
                                    src={addIcon}
                                    alt="btn-icon"
                                    className="btn-icon"
                                 />
                              </button>
                              <button
                                 className="btn task-btn"
                                 onClick={() => {
                                    navigate("add-task");
                                 }}
                              >
                                 Task
                                 <img
                                    src={addIcon}
                                    alt="btn-icon"
                                    className="btn-icon"
                                 />
                              </button>
                              <button
                                 className="btn meeting-btn"
                                 onClick={() => {
                                    navigate("add-meeting");
                                 }}
                              >
                                 Meeting
                                 <img
                                    src={addIcon}
                                    alt="btn-icon"
                                    className="btn-icon"
                                 />
                              </button>
                           </div>
                           <Table
                              tableCols={tableCols}
                              tableData={workspaceEvents}
                              resetPagination={resetPagination}
                              msg="There Are No Events To Show."
                           />
                        </div>
                        <UniversityLogo />
                     </div>
                  </main>
               </>
            );
         }
         // Status 2 => Finishing Work at Workspace
         else if (studentStatus?.workspace_status === 2) {
            return (
               <>
                  <Header userType={userType} />
                  <main className="main workspace-page">
                     <div className="container empty-workspace">
                        <div className="content">
                           <p className="text">This Workspace Was Finishing.</p>
                        </div>
                        <UniversityLogo />
                     </div>
                  </main>
               </>
            );
         }
         // Status 0 => Waiting For Coordonator Accept Or Reject
         else if (studentStatus?.workspace_status === 0) {
            return (
               <>
                  <Header userType={userType} />
                  <main className="main workspace-page">
                     <div className="container empty-workspace">
                        <div className="content">
                           <p className="text">
                              Încă nu aveți workspace. Starea de așteptare
                              coordonatorului.
                           </p>
                        </div>
                        <UniversityLogo />
                     </div>
                  </main>
               </>
            );
         } // Status null, 3 => You Don't have workspace
         else {
            return (
               <>
                  <Header userType={userType} />
                  <main className="main workspace-page">
                     <div className="container empty-workspace">
                        <div className="content">
                           <p className="text">
                              Nu aveți încă niciun workspace. Vă rugăm să
                              selectați o temă de la{" "}
                              <Link to="/list-of-topics" className="text_href">
                                 List De Teme
                              </Link>
                              .
                           </p>
                        </div>
                        <UniversityLogo />
                     </div>
                  </main>
               </>
            );
         }
      } else if (userType === "coordonator") {
         if (workspaceInfo?.student_id) {
            return (
               <>
                  <Header userType={userType} />
                  <main className="main workspace-page">
                     <div className="container">
                        <div className="workspace-end">
                           {/* <button
                              className="btn delete-btn"
                              onClick={() => {
                                 confirmProcess(
                                    "delete-workspace",
                                    workspaceInfo.workspace_id,
                                    "Sunteți sigur că vreți să ștergeți acest Workspace?"
                                 );
                              }}
                           >
                              Șterge
                           </button> */}
                           <button
                              className="btn post-btn"
                              onClick={() => {
                                 confirmProcess(
                                    "finish-workspace",
                                    [{ status: 2 }, workspaceInfo.workspace_id],
                                    "Sunteți sigur că vreți să terminați acest workspace?"
                                 );
                              }}
                           >
                              Finalizarea
                           </button>
                        </div>
                        <div className="content">
                           <ul className="workspace-info">
                              <li className="item">
                                 Titlul: {workspaceInfo.tema_name}
                              </li>
                              <li className="item">
                                 Coordonator: {JSON.parse(user)?.name}
                              </li>
                              <li className="item">
                                 Student: {workspaceInfo.student_email}
                              </li>
                           </ul>
                           <div className="workspace-btns">
                              <button
                                 className="btn post-btn"
                                 onClick={() => {
                                    navigate("add-post");
                                 }}
                              >
                                 Post
                                 <img
                                    src={addIcon}
                                    alt="btn-icon"
                                    className="btn-icon"
                                 />
                              </button>
                              <button
                                 className="btn task-btn"
                                 onClick={() => {
                                    navigate("add-task");
                                 }}
                              >
                                 Task
                                 <img
                                    src={addIcon}
                                    alt="btn-icon"
                                    className="btn-icon"
                                 />
                              </button>
                              <button
                                 className="btn meeting-btn"
                                 onClick={() => {
                                    navigate("add-meeting");
                                 }}
                              >
                                 Meeting
                                 <img
                                    src={addIcon}
                                    alt="btn-icon"
                                    className="btn-icon"
                                 />
                              </button>
                           </div>
                           <Table
                              tableCols={tableCols}
                              tableData={workspaceEvents}
                              resetPagination={resetPagination}
                              msg="There Are No Events To Show."
                           />
                        </div>
                        <UniversityLogo />
                     </div>
                  </main>
               </>
            );
         } else {
            return (
               <>
                  <Header userType={userType} />
                  <main className="main workspace-page">
                     <div className="empty-workspace container">
                        <p className="text">
                           Vă rog să selectați un student din pagina{" "}
                           <Link to="/students" className="text_href">
                              Studenți
                           </Link>{" "}
                           {/* Page */}
                        </p>
                        <UniversityLogo />
                     </div>
                  </main>
               </>
            );
         }
      } else {
         return <Navigate to="/homepage" />;
      }
   } else {
      return <Navigate to="/" />;
   }
};

export default Workspace;
