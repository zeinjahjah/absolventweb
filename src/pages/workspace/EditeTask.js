// External
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
// Internal
import Header from "../../components/Header";
import UniversityLogo from "../../components/UniversityLogo";
import addIcon from "../../assets/imgs/icons/addIcon.png";
import deleteIcon from "../../assets/imgs/icons/deleteIcon.png";
import { deleteEvent, editeEvent } from "../../redux/events/eventsAction";
import Spinning from "../../components/Spinning";
import {
   removeFile,
   uploadeFile,
} from "../../redux/attachments/attachmentsActions";

const EditeTask = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   const workspaceInfo = JSON.parse(localStorage.getItem("workspaceInfo"));
   // Compare User ID With Author ID To Prevent Not Author' Meeting Edite Or Delete
   const userId = JSON.parse(user)?.id;
   document.title = "Absolventweb | Edite Task";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const events = useSelector((state) => state.events);
   const workspaceEvents = useSelector((state) => state.events.workspaceEvents);
   const file = useSelector((state) => state.attachments);

   // ======================= Router Hook =======================
   const navigate = useNavigate();
   const { state } = useLocation();

   // ======================= Select Input Elements =======================
   const titleInput = useRef(null);
   const contentInput = useRef(null);
   const deadlineInput = useRef(null);
   const attachmentInput = useRef(null);

   // ======================= React Hook =======================
   // Store File Name To Show In The Screen
   const [fileName, setFileName] = useState(null);
   // For Error File Type
   const [fileType, setFileType] = useState(false);
   // Store File ID
   const [fileId, setFileID] = useState(null);
   // To Prevent Show Alert When The Previous Process Is Pending
   // const [btnClicked, setBtnClicked] = useState(false);
   // Store Event Id To Use It Inside Delete Event Action
   const [eventId, setEventId] = useState(null);
   // Select Process Type For Specific Button That Change To Spining
   const [processType, setProcessType] = useState({
      delete: false,
      edite: false,
   });
   // ############## Getting And Setting Event Infomation ##############
   useEffect(() => {
      // Prevent user to enter this page directly
      if (state?.eventId && workspaceEvents.length > 0) {
         const taskEvent = workspaceEvents.find(
            (task) => task.id === state.eventId
         );
         // Compare User ID With Author ID To Prevent Not Author's Task Edite Or Delete
         if (userId !== taskEvent.author_id) navigate("/workspace");
         setEventId(taskEvent.id);
         titleInput.current.focus();
         titleInput.current.value = taskEvent?.title ?? "";
         contentInput.current.value = taskEvent?.descriere ?? "";
         deadlineInput.current.value = taskEvent?.due_date ?? "";
         // Checking If There Is A file
         if (taskEvent.attachment) {
            setFileName(taskEvent.attachment.file_name);
            setFileID(taskEvent.attachment.id);
         }
      } else {
         navigate("/workspace");
      }
   }, []);

   // ======================= Sweet Alert Labrary =======================
   const processChecking = async (msg, icon, theClassName) => {
      await swal(msg, {
         buttons: false,
         timer: 3000,
         icon: icon,
         className: theClassName,
         closeOnEsc: false,
      });
   };

   // ======================= Vaidation =======================
   const fieldsValidation = (userInput) => {
      if (
         userInput.title === "" ||
         userInput.descriere === "" ||
         userInput.due_date === ""
      ) {
         processChecking("Please Fill All Fields.", "warning", "red-bg");
      } else {
         return true;
      }
   };

   // ======================= Handlder =======================
   const handleProcess = async () => {
      try {
         const userInput = {
            workspace_id: workspaceInfo.workspace_id,
            title: titleInput.current.value,
            descriere: contentInput.current.value,
            type: "task",
            due_date: deadlineInput.current.value,
         };
         if (fieldsValidation(userInput)) {
            let file = attachmentInput.current.files[0];

            // If There Is An Attachment Dispatch Upload Attachment Action
            if (file) {
               const { data } = await dispatch(
                  editeEvent({
                     eventID: state.eventId,
                     eventContent: userInput,
                  })
               ).unwrap();
               const event_ID = data.id;
               const fileData = new FormData();
               fileData.append("event_id", event_ID);
               fileData.append("file", file);
               await dispatch(uploadeFile(fileData)).unwrap();
            }
            // If There Is No An Attachment Dispatch Only Add Event Action
            else {
               await dispatch(
                  editeEvent({
                     eventID: state.eventId,
                     eventContent: userInput,
                  })
               ).unwrap();
            }
            await processChecking("Edit Successfully", "success", "done");
            navigate("/workspace");
         }
      } catch (err) {
         processChecking(err, "error", "red-bg");
      }
   };
   // Checking File Type And Remove Old File If Exist
   const handleFile = (theFileName) => {
      if (fileName) {
      } // show alert to Remove old file
      const fileTypes = ["csv", "txt", "xlx", "xls", "pdf", "zip"];
      if (fileTypes.includes(theFileName.slice(-3))) {
         setFileName(theFileName);
         setFileType(false);
      } else setFileType(true);
   };

   if (user) {
      return (
         <>
            <Header userType={userType} />
            <main className="main event-page">
               <div className="container">
                  <div className="content">
                     <div className="meta">
                        <h2 className="title">Modificare Task</h2>
                        {events.loading && processType.delete ? (
                           <Spinning size="small" />
                        ) : (
                           <button
                              className="btn delete-btn"
                              onClick={async () => {
                                 try {
                                    setProcessType({
                                       delete: true,
                                       edite: false,
                                    });
                                    await dispatch(
                                       deleteEvent(eventId)
                                    ).unwrap();
                                    await processChecking(
                                       "Deletion Successfully",
                                       "success",
                                       "done"
                                    );
                                    navigate("/workspace");
                                 } catch (err) {
                                    processChecking(err, "error", "red-bg");
                                 }
                              }}
                           >
                              Șterge
                           </button>
                        )}
                     </div>
                     <ul className="box">
                        <li className="item">
                           <h3 className="item_title">Titlu:</h3>
                           <input
                              type="text"
                              placeholder="Scrie aici"
                              className="input-field"
                              ref={titleInput}
                           />
                        </li>
                        <li className="item">
                           <h3 className="item_title">Conţinut:</h3>
                           <textarea
                              placeholder="Scrie aici"
                              className="textarea"
                              ref={contentInput}
                           ></textarea>
                        </li>
                        <li className="item">
                           <h3 className="item_title">Deadline:</h3>
                           <input
                              type="date"
                              placeholder="Scrie aici"
                              className="input-field"
                              ref={deadlineInput}
                           />
                        </li>
                        <li className="item">
                           <h3 className="item_title">Atașament:</h3>
                           <label htmlFor="file" className="file-input">
                              <img
                                 src={addIcon}
                                 alt="btn-icon"
                                 className="btn-icon"
                              />
                              Adaugare
                              <input
                                 id="file"
                                 type="file"
                                 className="input-field"
                                 ref={attachmentInput}
                                 onChange={() =>
                                    handleFile(
                                       attachmentInput.current.files[0].name
                                    )
                                 }
                              />
                           </label>
                        </li>
                        <li className="item">
                           {fileName ? (
                              <div className="attachName">
                                 {fileName}
                                 <img
                                    src={deleteIcon}
                                    alt="btn-icon"
                                    className="btn-icon"
                                    onClick={() => {
                                       attachmentInput.current.value = "";
                                       setFileName(null);
                                       // To Make This Btn Remove File From Database If Exist Only.
                                       if (fileId) {
                                          dispatch(removeFile(fileId));
                                          setFileID(null);
                                       }
                                    }}
                                 />
                              </div>
                           ) : null}
                        </li>
                        {fileType ? (
                           <li
                              className="item"
                              style={{ color: "red", justifyContent: "center" }}
                           >
                              <p style={{ textAlign: "center" }}>
                                 Fișierul trebuie să fie un fișier de tip: csv,
                                 txt, xlx, xls, pdf, zip.
                              </p>
                           </li>
                        ) : null}
                        <div className="save-btn-space">
                           {(events.loading && processType.edite) ||
                           file.loading ? (
                              <Spinning size="small" />
                           ) : (
                              <button
                                 className="btn save-btn"
                                 onClick={handleProcess}
                              >
                                 Salvare
                              </button>
                           )}
                        </div>
                     </ul>
                  </div>
                  <UniversityLogo />
               </div>
            </main>
         </>
      );
   } else {
      return <Navigate to="/" />;
   }
};

export default EditeTask;
