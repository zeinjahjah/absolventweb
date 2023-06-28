// External
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
// Internal
import Header from "../../components/Header";
import UniversityLogo from "../../components/UniversityLogo";
import addIcon from "../../assets/imgs/icons/addIcon.png";
import deleteIcon from "../../assets/imgs/icons/deleteIcon.png";
import Spinning from "../../components/Spinning";
import { addNewEvent } from "../../redux/events/eventsAction";

const AddMeeting = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   const workspaceInfo = JSON.parse(localStorage.getItem("workspaceInfo"));
   document.title = "Absolventweb | Add Meeting";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const events = useSelector((state) => state.events);

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

   // ======================= Handle Request =======================
   const handleProcess = () => {
      const userInput = {
         workspace_id: workspaceInfo.workspace_id,
         title: titleInput.current.value,
         type: "meeting",
         descriere: descInput.current.value,
         due_date: deadlineInput.current.value,
      };
      if (fieldsValidation(userInput)) {
         dispatch(addNewEvent(userInput));
      }
   };

   // ======================= React Hook =======================
   // To Prevent Show Alert When The Previous Process Is Pending
   const [btnClicked, setBtnClicked] = useState(false);
   // Variable below to manipulate useEffect and prevente run initial-render
   const firstUpdate = useRef(true);
   useEffect(() => {
      titleInput.current.focus();
      if (firstUpdate.current) {
         firstUpdate.current = false;
         return;
      }
      if (!events.loading && events.error && btnClicked) {
         processChecking(events.error, "error", "red-bg");
      } else if (!events.loading && events.success && btnClicked) {
         processChecking("Add Successfully", "success", "done").then(() =>
            navigate("/workspace")
         );
      }
   }, [events.error, events.success]);

   if (user) {
      return (
         <>
            <Header userType={userType} />
            <main className="main event-page">
               <div className="container">
                  <div className="content">
                     <h2 className="title">Meeting</h2>
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
                           {events.loading && btnClicked ? (
                              <Spinning size="small" />
                           ) : (
                              <button
                                 className="btn save-btn"
                                 onClick={() => {
                                    handleProcess();
                                    setBtnClicked(true);
                                 }}
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

export default AddMeeting;
