// External
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";

// Internal
import avatarIcon from "../../assets/imgs/icons/avatarIcon.png";
import attachIcon from "../../assets/imgs/icons/attachIcon.png";
import addCommentIcon from "../../assets/imgs/icons/addCommentIcon.png";
import Header from "../../components/Header";
import { deleteEvent, getEventById } from "../../redux/events/eventsAction";
import {
   addComment,
   deleteComment,
   editeComment,
   getComments,
} from "../../redux/comments/commentsAction";
import { getFile } from "../../redux/attachments/attachmentsActions";
import Spinning from "../../components/Spinning";

const Post = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   // Compare User ID With Author ID To Prevent Not Author' Post, Comment Edite Or Delete
   const userId = JSON.parse(user)?.id;
   document.title = "Absolventweb | Post";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const event = useSelector((state) => state.events.eventById);
   const eventsGlobal = useSelector((state) => state.events);
   const comments = useSelector((state) => state.comments.comments);
   const file = useSelector((state) => state.attachments);

   // ======================= Select Input Elements =======================
   const commentInput = useRef(null);
   const commentField = useRef(null);

   // ======================= React Hook =======================
   const [showOption, setShowOption] = useState(false);
   const [commentId, setCommentId] = useState(null);
   const [editeMode, setEidteMode] = useState(false);
   // For Show Post Dropdown Option, Edite Post, Delete Post
   const [showPostOption, setPostOption] = useState(false);
   // To Prevent Show Alert When The Previous Process Is Pending
   const [btnClicked, setBtnClicked] = useState(false);
   // Variable below to manipulate useEffect and prevente run initial-render
   const firstUpdate = useRef(true);

   useEffect(() => {
      if (state?.eventId) {
         dispatch(getEventById(state.eventId));
         dispatch(getComments(state.eventId));
      } else {
         navigate("/workspace");
      }
   }, []);
   useEffect(() => {
      if (firstUpdate.current) {
         firstUpdate.current = false;
         return;
      }
      if (!eventsGlobal.loading && eventsGlobal.error && btnClicked) {
         processChecking(eventsGlobal.error, "error", "red-bg");
      } else if (!eventsGlobal.loading && eventsGlobal.success && btnClicked) {
         processChecking("Delete Successfully", "success", "done").then(() =>
            navigate("/workspace")
         );
      }
   }, [eventsGlobal.error, eventsGlobal.success]);

   // ======================= Router Hook =======================
   const navigate = useNavigate();
   const { state } = useLocation();

   // ======================= Sweet Alert Labrary =======================
   // Check Box To Confirm Process
   const confirmDeletion = async () => {
      let checkBox = await swal("Doriți să ștergeți această postare?", {
         dangerMode: true,
         buttons: true,
      });
      if (checkBox) {
         dispatch(deleteEvent(event.id));
         setPostOption(false);
         setBtnClicked(true);
      }
   };
   const processChecking = async (msg, icon, theClassName) => {
      await swal(msg, {
         buttons: false,
         timer: 3000,
         icon: icon,
         className: theClassName,
         closeOnEsc: false,
      });
   };

   // ======================= Own Function =======================
   /**
    * Use This Function To Format Date Like Facebook
    * @param Date Represent The Date.
    * @returns Formated date.
    */
   const customDate = (theDate) => {
      if (!theDate) return "";
      const eventDate = new Date(theDate);
      const thisMoment = new Date();
      let min = (+thisMoment - eventDate) / 60000;
      let hour = min / 60;
      let day = hour / 24;
      let week = day / 7;

      if (min < 59) {
         if (Math.trunc(min) === 0) return `1 min ago`;
         return `${Math.trunc(min)} min ago`;
      } else if (min > 59 && hour < 24) {
         return `${Math.trunc(hour)} hours ago`;
      } else if (hour > 23 && day < 7) {
         return `${Math.trunc(day)} days ago`;
      } else if (day > 6) {
         return `${Math.trunc(week)} weeks ago`;
      }
   };

   /**
    * Use This Function To Increment Textarea Height Based On Its Content.
    * @param DOMElement Represent HTML Element To Increment Height.
    * @returns undefined
    */
   const textAreaAdjust = (element) => {
      // Reset Height Every keyup
      element.style.height = "1px";
      element.style.height = `${10 + element.scrollHeight}px`;
   };

   // ======================= Handler =======================
   const handleDownloade = () => {
      // Send Request
      dispatch(getFile(event.id)).then(({ payload }) => {
         const blob = new Blob([payload]);
         const href = URL.createObjectURL(blob);
         // Create Anhor Link Element
         const anchorLink = document.createElement("a");
         // Hide Element
         anchorLink.style.display = "none";
         // Add Href And File Name
         anchorLink.href = href;
         anchorLink.download = event.attachment.file_name;
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
            <main className="main post-page">
               <div className="container">
                  <div className="content">
                     <h2 className="title">Post</h2>
                     <div className="box">
                        <div className="info">
                           <header className="post-header">
                              <div className="title">
                                 <img
                                    src={avatarIcon}
                                    alt="avatar-icon"
                                    className="btn-icon"
                                 />
                                 <h3 className="username">
                                    {event.author_name}
                                 </h3>
                              </div>
                              <ul
                                 className={`points ${
                                    userId !== event?.author_id
                                       ? "hide-points"
                                       : ""
                                 }`}
                                 onClick={() => {
                                    if (showPostOption) {
                                       setPostOption(false);
                                    } else {
                                       setPostOption(true);
                                    }
                                 }}
                              >
                                 <li className="point"></li>
                                 <li className="point"></li>
                                 <li className="point"></li>
                                 <li className="nested-list">
                                    <ul
                                       className={`options ${
                                          showPostOption ? "show" : ""
                                       }`}
                                    >
                                       <li
                                          className="option"
                                          onClick={confirmDeletion}
                                       >
                                          Șterge
                                       </li>
                                       <li
                                          className="option"
                                          onClick={() => {
                                             navigate("/workspace/edite-post", {
                                                state: {
                                                   eventId: event.id,
                                                },
                                             });
                                          }}
                                       >
                                          Modificare
                                       </li>
                                    </ul>
                                 </li>
                              </ul>
                           </header>
                           <div className="post-info">
                              <h4 className="topic-name">{event?.title}</h4>
                              <p className="the-date">
                                 {customDate(event?.updated_at)}
                              </p>
                           </div>
                        </div>
                        <div className="text">
                           <p style={{ whiteSpace: "pre-wrap" }}>
                              {event?.descriere}
                           </p>
                           <div className="post-deadlin">
                              <h4>Deadline:</h4>
                              <p className="text">{event?.due_date}</p>
                           </div>
                           {event.attachment ? (
                              <div className="attatchment-download">
                                 {file.loading ? (
                                    <Spinning size="small" />
                                 ) : (
                                    <button
                                       className="btn"
                                       onClick={handleDownloade}
                                    >
                                       {event.attachment.file_name}
                                       <img
                                          src={attachIcon}
                                          alt="download-icon"
                                       />
                                    </button>
                                 )}
                              </div>
                           ) : null}
                        </div>
                        <div className="comments">
                           <div className="add-comment">
                              <img
                                 src={avatarIcon}
                                 alt="avatar-icon"
                                 className="btn-icon"
                              />
                              <textarea
                                 placeholder="Scrie aici"
                                 className="input-field"
                                 onKeyUp={() =>
                                    textAreaAdjust(commentInput.current)
                                 }
                                 ref={commentInput}
                              ></textarea>
                              <button
                                 className="send"
                                 onClick={() => {
                                    if (commentInput.current.value !== "") {
                                       dispatch(
                                          addComment({
                                             event_id: state.eventId,
                                             content:
                                                commentInput.current.value,
                                          })
                                       ).then(() =>
                                          dispatch(getComments(state.eventId))
                                       );
                                       commentInput.current.value = "";
                                    }
                                 }}
                              >
                                 <img
                                    src={addCommentIcon}
                                    alt="btn-icon"
                                    className="btn-icon"
                                 />
                              </button>
                           </div>
                        </div>
                     </div>
                     <div className="comments-list">
                        <h3 className="title">({comments.length}) Comentarii</h3>
                        {comments.length > 0
                           ? comments.map((comment, i) => (
                                <div key={i} className="comment">
                                   <div className="author-name">
                                      <img
                                         src={avatarIcon}
                                         alt="avatar-icon"
                                         className="btn-icon"
                                      />
                                      <h3 className="username">
                                         {comment.author_name}
                                      </h3>
                                      <span className="the-date">
                                         {customDate(comment?.updated_at)}
                                      </span>
                                      <div className="comment-btns">
                                         <ul
                                            className={`points ${
                                               userId !== comment?.author_id
                                                  ? "hide-points"
                                                  : ""
                                            }`}
                                            onClick={() => {
                                               setCommentId(comment.id);
                                               setEidteMode(false);
                                               if (showOption)
                                                  setShowOption(false);
                                               else setShowOption(true);
                                            }}
                                         >
                                            <li className="point"></li>
                                            <li className="point"></li>
                                            <li className="point"></li>
                                         </ul>
                                         <ul
                                            className={`options ${
                                               showOption &&
                                               commentId === comment.id
                                                  ? "show"
                                                  : ""
                                            }`}
                                         >
                                            <li
                                               className="option"
                                               onClick={() => {
                                                  dispatch(
                                                     deleteComment(comment.id)
                                                  );
                                               }}
                                            >
                                               Șterge
                                            </li>
                                            <li
                                               className="option"
                                               onClick={() => {
                                                  setEidteMode(true);
                                                  setShowOption(false);
                                               }}
                                            >
                                               Modificare
                                            </li>
                                         </ul>
                                      </div>
                                   </div>
                                   {editeMode && commentId === comment.id ? (
                                      <>
                                         <textarea
                                            placeholder="Scrie aici"
                                            className="input-field"
                                            onKeyUp={() =>
                                               textAreaAdjust(
                                                  commentField.current
                                               )
                                            }
                                            ref={commentField}
                                            defaultValue={comment.content}
                                         ></textarea>
                                         <span
                                            className="comment-edition"
                                            onClick={() => {
                                               setEidteMode(false);
                                               dispatch(
                                                  editeComment({
                                                     commentId: comment.id,
                                                     commentContent: {
                                                        content:
                                                           commentField.current
                                                              .value,
                                                     },
                                                  })
                                               ).then(() =>
                                                  dispatch(
                                                     getComments(state.eventId)
                                                  )
                                               );
                                            }}
                                         >
                                            Ok
                                         </span>
                                         .
                                         <span
                                            className="comment-edition"
                                            onClick={() => {
                                               setEidteMode(false);
                                            }}
                                         >
                                            Anulare
                                         </span>
                                      </>
                                   ) : (
                                      <p className="text">{comment.content}</p>
                                   )}
                                </div>
                             ))
                           : null}
                     </div>
                  </div>
               </div>
            </main>
         </>
      );
   } else {
      return <Navigate to="/" />;
   }
};

export default Post;
