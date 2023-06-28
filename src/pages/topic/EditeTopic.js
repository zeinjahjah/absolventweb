// External
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import swal from "sweetalert";
// Internal
import Header from "../../components/Header";
import UniversityLogo from "../../components/UniversityLogo";
import Spinning from "../../components/Spinning";
import { editeTopic } from "../../redux/topics/topicsActions";
import { temaTypes } from "../../data/globalDate";

export const EditeTopic = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   document.title = "Absolventweb | Edite Tema";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const topics = useSelector((state) => state.topics);

   // ======================= Router Hook =======================
   const { state } = useLocation();
   const navigate = useNavigate();

   // ======================= Select Input Elements =======================
   const titleInput = useRef(null);
   const TipTema = useRef(null);
   const detailsInput = useRef(null);
   const specInput = useRef(null);

   // ======================= React Hook =======================
   // Store Selected Option Index
   const [selectedTip, setSelectedTip] = useState(null);

   useEffect(() => {
      // Prevent User Enter This Page Directly
      if (state?.id && topics.topicsByDoctor.length > 0) {
         const topic = topics.topicsByDoctor[0].teme.find(
            (tema) => tema.id === state.id
         );
         titleInput.current.focus();
         titleInput.current.value = topic?.title ?? "";
         const type = temaTypes.indexOf(topic?.tema_type);
         if (type === -1) setSelectedTip(null);
         else setSelectedTip(type);
         detailsInput.current.value = topic?.detalii ?? "";
         specInput.current.value = topic?.specializare ?? "";
      } else {
         navigate("/profile");
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
      if (!Object.values(userInput).every((e) => e !== "")) {
         processChecking("Please Fill All Fields.", "warning", "red-bg");
      } else {
         return true;
      }
   };

   // ======================= Handle Request =======================
   const handleProcess = () => {
      const userInput = {
         title: titleInput.current.value,
         tema_type: temaTypes[selectedTip],
         detalii: detailsInput.current.value,
         specializare: specInput.current.value,
      };
      if (fieldsValidation(userInput)) {
         dispatch(
            editeTopic({
               topicId: state?.id,
               topic: userInput,
            })
         )
            .unwrap()
            .then(async () => {
               await processChecking("Edite Successfully", "success", "done");
               navigate("/profile");
            })
            .catch((err) => {
               processChecking(err, "error", "red-bg");
            });
      }
   };

   if (user && userType === "coordonator") {
      return (
         <>
            <Header userType={userType} />
            <main className="main topic-page">
               <div className="container">
                  <div className="content">
                     <h2 className="title">Modificare detalii unei teme</h2>
                     <ul className="box">
                        <li className="item">
                           <h3 className="item_title">Titlul temei:</h3>
                           <input
                              type="text"
                              placeholder="Scrie aici"
                              className="input-field"
                              ref={titleInput}
                           />
                        </li>
                        <li className="item">
                           <h3 className="item_title">Tip temă:</h3>
                           <div
                              className="custom-select"
                              onClick={(_) => {
                                 TipTema.current.classList.toggle(
                                    "show-options"
                                 );
                              }}
                           >
                              {selectedTip !== null ? (
                                 <p>{temaTypes[selectedTip]}</p>
                              ) : (
                                 <p>Tema Type</p>
                              )}
                              <span className="arrow"></span>
                              <ul className="select" ref={TipTema}>
                                 {temaTypes.map((tip, i) => {
                                    return (
                                       <li
                                          key={i}
                                          className="option"
                                          onClick={(_) => {
                                             setSelectedTip(i);
                                          }}
                                       >
                                          {tip}
                                       </li>
                                    );
                                 })}
                              </ul>
                           </div>
                        </li>
                        <li className="item">
                           <h3 className="item_title">Detalii Tema:</h3>
                           <textarea
                              placeholder="Scrie aici"
                              className="textarea"
                              ref={detailsInput}
                           ></textarea>
                        </li>
                        <li className="item">
                           <h3 className="item_title">Specializare:</h3>
                           <input
                              type="text"
                              placeholder="Scrie aici"
                              className="input-field"
                              ref={specInput}
                           />
                        </li>

                        <div className="save-btn-space">
                           {topics.loading ? (
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
      <Navigate to="/profile" />;
   }
};
export default EditeTopic;
