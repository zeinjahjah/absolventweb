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

const EditeMeeting = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   const workspaceInfo = JSON.parse(localStorage.getItem("workspaceInfo"));
   // Compare User ID With Author ID To Prevent Not Author' Meeting Edite Or Delete
   const userId = JSON.parse(user)?.id;
   document.title = "Absolventweb | Edite Meeting";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const events = useSelector((state) => state.events);
   const workspaceEvents = useSelector((state) => state.events.workspaceEvents);
   const { state } = useLocation();

   // ======================= Router Hook =======================
   const navigate = useNavigate();

   // ======================= Select Input Elements =======================
   const titleInput = useRef(null);
   const descInput = useRef(null);
   const deadlineInput = useRef(null);

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
         userInput.due_date === "" ||
         userInput.descriere === ""
      ) {
         processChecking("Please Fill All Fields.", "warning", "red-bg");
      } else {
         return true;
      }
   };

   // ======================= Handlder =======================
   const handleProcess = () => {
      const userInput = {
         workspace_id: workspaceInfo.workspace_id,
         title: titleInput.current.value,
         type: "meeting",
         descriere: descInput.current.value,
         due_date: deadlineInput.current.value,
      };
      if (fieldsValidation(userInput)) {
         setProcessType({ delete: false, edite: true });
         dispatch(
            editeEvent({ eventID: state.eventId, eventContent: userInput })
         );
         setBtnClicked(true);
      }
   };

   // ======================= React Hook =======================
   // To Prevent Show Alert When The Previous Process Is Pending
   const [btnClicked, setBtnClicked] = useState(false);
   // Store Event Id To Use It Inside Delete Event Action
   const [eventId, setEventId] = useState(null);
   // Select Process Type For Specific Button That Change To Spining
   const [processType, setProcessType] = useState({
      delete: false,
      edite: false,
   });
   // Variable below to manipulate useEffect and prevente run initial-render
   const firstUpdate = useRef(true);
   useEffect(() => {
      // Prevent user to enter this page directly
      if (state?.eventId && workspaceEvents.length > 0) {
         const postEvent = workspaceEvents.find(
            (post) => post.id === state.eventId
         );
         // Compare User ID With Author ID To Prevent Not Author' Meeting Edite Or Delete
         if (userId !== postEvent.author_id) navigate("/workspace");
         setEventId(postEvent.id);
         titleInput.current.focus();
         titleInput.current.value = postEvent?.title ?? "";
         deadlineInput.current.value = postEvent?.due_date ?? "";
         descInput.current.value = postEvent?.descriere ?? "";
      } else {
         navigate("/workspace");
      }
   }, []);
   // Checking Process
   useEffect(() => {
      if (firstUpdate.current) {
         firstUpdate.current = false;
         return;
      }
      if (!events.loading && events.error && btnClicked) {
         processChecking(events.error, "error", "red-bg");
         setBtnClicked(false);
      } else if (!events.loading && events.success && btnClicked) {
         processChecking("Process Successfully", "success", "done").then(() =>
            navigate("/workspace")
         );
         setBtnClicked(false);
      }
   }, [events.error, events.success]);

   if (user) {
      return (
         <>
            <Header userType={userType} />
            <main className="main event-page">
               <div className="container">
                  <div className="content">
                     <div className="meta">
                        <h2 className="title">Modificare Meeting</h2>
                        {events.loading && processType.delete ? (
                           <Spinning size="small" />
                        ) : (
                           <button
                              className="btn delete-btn"
                              onClick={() => {
                                 setProcessType({ delete: true, edite: false });
                                 dispatch(deleteEvent(eventId))
                                    .unwrap()
                                    .then(async () => {
                                       navigate("/workspace");
                                    });
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
                           <input
                              type="text"
                              placeholder="Scrie aici"
                              className="input-field"
                              ref={descInput}
                           />
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
                        <div className="save-btn-space">
                           {events.loading && processType.edite ? (
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

export default EditeMeeting;
