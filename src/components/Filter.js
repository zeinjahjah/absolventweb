import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ProgrammingLangList, TipTemaList } from "../data/globalDate";
import { setSearchMethod, setSearchMode } from "../redux/global/globalSlice";
import { searchByProgrammingLang } from "../redux/topics/topicsSlice";

const Filter = ({
   coordinator,
   student,
   tema,
   programmingLang,
   topicType,
   searchMethod,
}) => {
   // ======================= Redux Hook =======================
   const dispatch = useDispatch();

   // ======================= React Hook =======================
   // Store Selected Option Index
   const [selectedLang, setSelectedLang] = useState(null);
   // Store Selected Option Index
   const [selectedTip, setSelectedTip] = useState(null);

   // ======================= Select Elements =======================
   const programmingLangFilter = useRef(null);
   const TipTema = useRef(null);
   const doctorFiter = useRef(null);
   const studentFilter = useRef(null);
   const temaFilter = useRef(null);

   return (
      <div className="filter">
         <h3 className="filter_title">Filtru</h3>
         <div className="filter_options">
            {coordinator ? (
               <p
                  className="filter_option"
                  ref={doctorFiter}
                  onClick={(_) => {
                     if (doctorFiter.current.classList.contains("selected")) {
                        doctorFiter.current.classList.remove("selected");
                        dispatch(setSearchMethod("searchGlobaly"));
                     } else {
                        doctorFiter.current.classList.add("selected");
                        dispatch(setSearchMethod("serachByCoordinator"));
                     }
                  }}
               >
                  Coordonator
               </p>
            ) : null}
            {student ? (
               <p
                  className="filter_option"
                  ref={studentFilter}
                  onClick={(_) => {
                     if (studentFilter.current.classList.contains("selected")) {
                        studentFilter.current.classList.remove("selected");
                        dispatch(setSearchMethod("searchCoordinators"));
                     } else {
                        studentFilter.current.classList.add("selected");
                        dispatch(setSearchMethod("searchStudent"));
                     }
                  }}
               >
                  Student
               </p>
            ) : null}
            {tema ? (
               <p
                  className="filter_option"
                  ref={temaFilter}
                  onClick={(_) => {
                     if (temaFilter.current.classList.contains("selected")) {
                        temaFilter.current.classList.remove("selected");
                        dispatch(setSearchMethod("searchCoordinators"));
                     } else {
                        temaFilter.current.classList.add("selected");
                        dispatch(setSearchMethod("searchTema"));
                     }
                  }}
               >
                  Tema
               </p>
            ) : null}
            {programmingLang ? (
               <div
                  className="custom-select"
                  onClick={(_) => {
                     programmingLangFilter.current.classList.toggle(
                        "show-options"
                     );
                     setSelectedTip(null);
                  }}
               >
                  {selectedLang !== null ? (
                     <p>{ProgrammingLangList[selectedLang]}</p>
                  ) : (
                     <p>Limbaj de programare</p>
                  )}
                  <span className="arrow"></span>
                  <ul className="select" ref={programmingLangFilter}>
                     {ProgrammingLangList.map((lang, i) => {
                        return (
                           <li
                              key={i}
                              className="option"
                              onClick={(_) => {
                                 setSelectedLang(i);
                                 dispatch(searchByProgrammingLang(lang));
                                 // Making Search Mode Ture To Reset All Pagination To Start Point
                                 dispatch(setSearchMode(true));
                              }}
                           >
                              {lang}
                           </li>
                        );
                     })}
                  </ul>
               </div>
            ) : null}
            {topicType ? (
               <div
                  className="custom-select"
                  onClick={(_) => {
                     TipTema.current.classList.toggle("show-options");
                     setSelectedLang(null);
                  }}
               >
                  {selectedTip !== null ? (
                     <p>{TipTemaList[selectedTip]}</p>
                  ) : (
                     <p>Tip Tema</p>
                  )}
                  <span className="arrow"></span>
                  <ul className="select" ref={TipTema}>
                     {TipTemaList.map((tip, i) => {
                        return (
                           <li
                              key={i}
                              className="option"
                              onClick={(_) => {
                                 setSelectedTip(i);
                                 dispatch(searchMethod(tip));
                                 // Making Search Mode Ture To Reset All Pagination To Start Point
                                 dispatch(setSearchMode(true));
                              }}
                           >
                              {tip}
                           </li>
                        );
                     })}
                  </ul>
               </div>
            ) : null}
         </div>
      </div>
   );
};

export default Filter;
