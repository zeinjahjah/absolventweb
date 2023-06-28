// External
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
// Internal
import checkIcon from "../assets/imgs/icons/checkIcon.png";
import editeIcon from "../assets/imgs/icons/editeIcon.png";
import deleteIcon from "../assets/imgs/icons/deleteIcon.png";
import attachIcon from "../assets/imgs/icons/attachIcon.png";
import Spinning from "./Spinning";
import { seBtnProcess, setWorkspaceInfo } from "../redux/global/globalSlice";
import { deleteTopic } from "../redux/topics/topicsActions";
import {
   changeWorkspaceStatus,
   getWaitingWorkspace,
} from "../redux/workspaces/workspacesActions";
import { getFile } from "../redux/attachments/attachmentsActions";

const TableProcess = ({
   process,
   selectionInfo,
   workspaceInfo,
   temaId,
   workspaceId,
   eventType,
   eventId,
   eventTitle,
   fileName,
}) => {
   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const selectedTema = useSelector(
      (state) => state.global.workspaceInfo.tema_id
   );
   const userStatus = useSelector((state) => state.users.studentStatus);
   const topics = useSelector((state) => state.topics);
   const workspace = useSelector((state) => state.workspaces);
   const btnProcess = useSelector((state) => state.global.btnProcess);
   const file = useSelector((state) => state.attachments);

   // ======================= Redux Hook =======================
   // To Prevent Show Loading Spin Unless Selected Tema
   const [selectedTemaId, setSelectedTemaId] = useState(null);
   // To Prevent Show Loading Spin Unless Selected Workspace => Used Inside [Accept, Reject]
   const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
   // To Prevent Show Loading Spin Unless Selected Event
   const [selectedEventId, setSelectedEventId] = useState(null);

   // ======================= Router Hook =======================
   const navigate = useNavigate();

   // ======================= Handler =======================
   const handleDownload = () => {
      // Save Event ID To Make Exactly File Spining
      setSelectedEventId(eventId);
      // Send Request
      dispatch(getFile(eventId)).then(({ payload }) => {
         const blob = new Blob([payload]);
         const href = URL.createObjectURL(blob);
         // Create Anhor Link Element
         const anchorLink = document.createElement("a");
         // Hide Element
         anchorLink.style.display = "none";
         // Add Href And File Name
         anchorLink.href = href;
         anchorLink.download = fileName;
         // Append Element To Document
         document.body.append(anchorLink);
         // Auto Click To Start Download
         anchorLink.click();
         // Remove Element And URL After End Download Process
         anchorLink.remove();
         URL.revokeObjectURL(href);
         setSelectedEventId(null); // Reset
      });
   };
   const handleSelection = () => {
      // Prevent User Click If His Status Equal 0 Or 1
      if (
         userStatus?.workspace_status === 1 ||
         userStatus?.workspace_status === 0 ||
         selectionInfo.is_taken === 1
      ) {
         return;
      } // Allow User Click If His Status Doesn't Equal 0 Or 1
      else {
         if (selectedTema === selectionInfo.tema_id) {
            dispatch(
               setWorkspaceInfo({
                  tema_id: null,
                  coordonator_id: null,
               })
            );
         } else {
            dispatch(setWorkspaceInfo(selectionInfo));
         }
      }
   };
   // ======================= Sweet Alert Labrary =======================
   // Check Box To Confirm Process
   const confirmProcess = async (method, token, msg, processStatus) => {
      let checkBox = await swal(msg, {
         dangerMode: true,
         buttons: true,
      });
      if (checkBox) {
         // Set Action Method
         dispatch(method(token));
         // Set Btn Status To Use It Later To Show Alert Or Not
         dispatch(seBtnProcess(processStatus));
      }
   };

   // Workspace Page => For Cell Contain Title As Link Route You To Event By Event_ID
   if (process?.link) {
      if (eventType === "post") {
         return (
            <Link
               to="post"
               state={{
                  eventId: eventId,
               }}
            >
               {eventTitle}
            </Link>
         );
      } else if (eventType === "task") {
         return (
            <Link
               to="task"
               state={{
                  eventId: eventId,
               }}
            >
               {eventTitle}
            </Link>
         );
      } else if (eventType === "meeting") {
         return (
            <Link
               to="edite-meeting"
               state={{
                  eventId: eventId,
               }}
            >
               {eventTitle}
            </Link>
         );
      }
   } // Workspace Page => For Cell Contain Download Btn To Download An Attachment By Event_ID
   else if (process?.file) {
      return (
         <div className="wraper">
            {file.loading && selectedEventId === eventId ? (
               <Spinning size="small" />
            ) : (
               <img
                  src={attachIcon}
                  alt="download-icon"
                  style={{ cursor: "pointer" }}
                  onClick={handleDownload}
               />
            )}
         </div>
      );
   } // Students Page => For Cell Contain Btn To Show Student's Workspace By Student_ID
   else if (process?.show) {
      return (
         <div className="wraper">
            <button
               className="btn show-btn"
               onClick={() => {
                  localStorage.setItem(
                     "workspaceInfo",
                     JSON.stringify(workspaceInfo)
                  );
                  navigate("/workspace");
               }}
            >
               Show
            </button>
         </div>
      );
   } // List Of Topic Page => For Cell Contain Select Btn To Select One Tema
   else if (process?.select) {
      return (
         <div
            className={`wraper ${
               selectedTema === selectionInfo.tema_id ? "selected" : ""
            } 
         ${
            userStatus?.workspace_status === 1 ||
            userStatus?.workspace_status === 0 ||
            selectionInfo.is_taken === 1
               ? "disable"
               : ""
         }            
         `}
         >
            <div className="select-box" onClick={handleSelection}>
               <img src={checkIcon} alt="check-icon" className="btn-icon" />
            </div>
         </div>
      );
   } // Profile Page => For Cell Contain Edite And Delete Btns
   else if (process?.edite && process?.delete) {
      return (
         <div className="topic-btns">
            <button
               className="btn edite-btn"
               onClick={() =>
                  navigate("edite-topic", {
                     state: {
                        id: temaId,
                     },
                  })
               }
            >
               Modificare
               <img src={editeIcon} alt="edite-icon" className="btn-icon" />
            </button>
            {topics.loading && selectedTemaId === temaId ? (
               <Spinning size="small" />
            ) : (
               <button
                  className="btn delete-btn"
                  onClick={() => {
                     confirmProcess(
                        deleteTopic,
                        temaId,
                        "Dumneavoastră Sunteţi sigur cu șterge temă?",
                        {
                           deleteTema: true,
                        }
                     );
                     setSelectedTemaId(temaId);
                  }}
               >
                  Șterge
                  <img
                     src={deleteIcon}
                     alt="delete-icon"
                     className="btn-icon"
                  />
               </button>
            )}
         </div>
      );
   } // Homepage Coordonator => For Cell Contain Accept And Reject Btns
   else if (process?.acceptBtn && process?.rejectBtn) {
      return (
         <div className="status">
            <div className="topic-btns ">
               {workspace.loading &&
               workspaceId === selectedWorkspaceId &&
               btnProcess.acceptStudent ? (
                  <Spinning size="small" />
               ) : (
                  <button
                     className="btn edite-btn"
                     onClick={() => {
                        confirmProcess(
                           changeWorkspaceStatus,
                           [
                              {
                                 status: 1,
                              },
                              workspaceId,
                           ],
                           "Sunteţi sigur că vreţi să acceptaţi acest student?",
                           {
                              acceptStudent: true,
                           }
                        );
                        setSelectedWorkspaceId(workspaceId);
                     }}
                  >
                     Accept
                     <img
                        src={checkIcon}
                        alt="check-icon"
                        className="btn-icon"
                     />
                  </button>
               )}
               {workspace.loading &&
               workspaceId === selectedWorkspaceId &&
               btnProcess.rejectStudent ? (
                  <Spinning size="small" />
               ) : (
                  <button
                     className="btn delete-btn"
                     onClick={async () => {
                        setSelectedWorkspaceId(workspaceId);
                        let checkBox = await swal(
                           "Sunteţi sigur că vreți să respingeţi acest student?",
                           {
                              dangerMode: true,
                              buttons: true,
                           }
                        );
                        if (checkBox) {
                           // Set Action Method
                           await dispatch(
                              changeWorkspaceStatus([
                                 {
                                    status: 3,
                                 },
                                 workspaceId,
                              ])
                           );
                           // Set Btn Status To Use It Later To Show Alert Or Not
                           dispatch(
                              seBtnProcess({
                                 rejectStudent: true,
                              })
                           );
                           dispatch(getWaitingWorkspace());
                        }
                     }}
                  >
                     Respinge
                     <img
                        src={deleteIcon}
                        alt="delete-icon"
                        className="btn-icon"
                     />
                  </button>
               )}
            </div>
         </div>
      );
   } else return <p>Empty</p>;
};

export default TableProcess;
