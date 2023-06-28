// External
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import swal from "sweetalert";
// Internal
import Header from "../../components/Header";
import UniversityLogo from "../../components/UniversityLogo";
import { addNewTopic } from "../../redux/topics/topicsActions";
import Spinning from "../../components/Spinning";
import { temaTypes } from "../../data/globalDate";

const AddNewTopic = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   document.title = "Absolventweb | Add Tema";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const topics = useSelector((state) => state.topics);

   // ======================= Router Hook =======================
   const navigate = useNavigate();

   // ======================= Select Input Elements =======================
   const titleInput = useRef(null);
   const TipTema = useRef(null);
   const detailsInput = useRef(null);
   const specInput = useRef(null);

   // ======================= React Hook =======================
   // Store Selected Option Index
   const [selectedTip, setSelectedTip] = useState(null);
   // To Prevent Show Alert When The Previous Process Is Pending
   const [btnClicked, setBtnClicked] = useState(false);

   useEffect(() => {
      titleInput.current.focus();
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
      if (!Object.values(userInput).every((e) => e !== ""))
         processChecking("Please Fill All Fields.", "warning", "red-bg");
      else return true;
   };

   // ======================= Handle Request =======================
   const handleProcess = () => {
      const userInput = {
         title: titleInput.current.value,
         tema_type: temaTypes[selectedTip] || "",
         detalii: detailsInput.current.value,
         specializare: specInput.current.value,
      };
      if (fieldsValidation(userInput)) {
         dispatch(addNewTopic(userInput))
            .unwrap()
            .then(async () => {
               await processChecking("Add Successfully", "success", "done");
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
                     <h2 className="title">Adăugarea o temă nouă</h2>
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
                           <h3 className="item_title">Tip tema:</h3>
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
                                 <p>Tip tema</p>
                              )}
                              <span className="arrow"></span>
                              <ul className="select" ref={TipTema}>
                                 {temaTypes.map((tip, i) => {
                                    return (
                                       <li
                                          key={i}
                                          className="option"
                                          onClick={(_) => setSelectedTip(i)}
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
                           {topics.loading && btnClicked ? (
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
      <Navigate to="/profile" />;
   }
};

export default AddNewTopic;
