// External
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
// Internal
import attachIcon from "../../assets/imgs/icons/attachIcon.png";
import Header from "../../components/Header";
import UniversityLogo from "../../components/UniversityLogo";
import { getFile } from "../../redux/attachments/attachmentsActions";
import Spinning from "../../components/Spinning";

const Task = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   // Compare User ID With Author ID To Prevent Not Author' Task, Edite Or Delete
   const userId = JSON.parse(user)?.id;
   document.title = "Absolventweb | Task";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const workspaceEvents = useSelector((state) => state.events.workspaceEvents);
   const file = useSelector((state) => state.attachments);

   // ======================= React Hook =======================
   // Store Task_ID
   const [taskById, setTaskById] = useState({});

   useEffect(() => {
      // Prevent User Enter This Page Directly
      if (state?.eventId && workspaceEvents.length > 0) {
         const task = workspaceEvents.find((task) => task.id === state.eventId);
         setTaskById(task);
      } else {
         navigate("/workspace");
      }
   }, []);

   // ======================= Router Hook =======================
   const navigate = useNavigate();
   const { state } = useLocation();

   // ======================= Handler =======================
   const handleDownloade = () => {
      // Send Request
      dispatch(getFile(taskById.id)).then(({ payload }) => {
         const blob = new Blob([payload]);
         const href = URL.createObjectURL(blob);
         // Create Anhor Link Element
         const anchorLink = document.createElement("a");
         // Hide Element
         anchorLink.style.display = "none";
         // Add Href And File Name
         anchorLink.href = href;
         anchorLink.download = taskById.attachment.file_name;
         // Append Element To Document
         document.body.append(anchorLink);
         // Auto Click To Start Download
         anchorLink.click();
         // Remove Element And URL After End Download Process
         anchorLink.remove();
         URL.revokeObjectURL(href);
      });
   };

   if (user) {
      return (
         <>
            <Header userType={userType} />
            <main className="main task-page">
               <div className="container">
                  <div className="content">
                     <h2 className="title">Task</h2>
                     <div className="box">
                        <h3 className="task-title">{taskById?.title}</h3>
                        <p
                           className="task-content"
                           style={{ whiteSpace: "pre-wrap" }}
                        >
                           {taskById?.descriere}
                        </p>
                        <div className="task-deadlin">
                           <h4>Deadline:</h4>
                           <p className="text">{taskById?.due_date}</p>
                        </div>
                        {taskById.attachment ? (
                           <div className="attatchment-download">
                              {file.loading ? (
                                 <Spinning size="small" />
                              ) : (
                                 <button
                                    className="btn"
                                    onClick={handleDownloade}
                                 >
                                    {taskById.attachment.file_name}
                                    <img src={attachIcon} alt="download-icon" />
                                 </button>
                              )}
                           </div>
                        ) : null}
                        {taskById.author_id === userId ? (
                           <div className="edite-btn-space">
                              <button
                                 className="btn save-btn"
                                 onClick={() => {
                                    navigate("/workspace/edite-task", {
                                       state: {
                                          eventId: state?.eventId,
                                       },
                                    });
                                 }}
                              >
                                 Modificare
                              </button>
                           </div>
                        ) : null}
                     </div>
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

export default Task;
