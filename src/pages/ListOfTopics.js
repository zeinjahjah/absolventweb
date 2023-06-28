// External
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import swal from "sweetalert";
// Internal
import Header from "../components/Header";
import Search from "../components/Search";
import Filter from "../components/Filter";
import {
   getAllTopicsByDoctor,
   getTopicsByDoctorId,
} from "../redux/topics/topicsActions";
import { createWorkspace } from "../redux/workspaces/workspacesActions";
import { getStudentStatus } from "../redux/users/uersAction";
import Spinning from "../components/Spinning";
import {
   searchByCoordinator,
   searchGlobaly,
} from "../redux/topics/topicsSlice";
import Table from "../components/Table";
import { setSearchMethod } from "../redux/global/globalSlice";
import { getCoordinatorTemeTable } from "../redux/export/exportActions";
import arrowUpIcon from "../assets/imgs/icons/arrowUpIcon.png";
import addIcon from "../assets/imgs/icons/addIcon.png";

const ListOfTopics = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   document.title = "Absolventweb | Teme Propuse";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const topicsByDoctor = useSelector((state) => state.topics.topicsByDoctor);
   const workspace = useSelector((state) => state.workspaces);
   // Use This To Get Selected Tema Information To Send It To Create Workspace With 0 Status
   const workspaceInfo = useSelector((state) => state.global.workspaceInfo);
   // Use This To Get Student Status
   const userStatus = useSelector((state) => state.users.studentStatus);
   // Use This To Get Selected Search Method
   const searchMethod = useSelector((state) => state.global.searchMethod);
   // For Table Msg [Coordinator] Show Diff Msg Based On SearchMode
   const { searchMode } = useSelector((state) => state.global);
   const exportProcess = useSelector((state) => state.export);

   // ======================= React Hook =======================
   // Specify Search Method To Send It To Search Compnent
   const [theSearchMethod, setTheSearchMethod] = useState({
      searchGlobaly: searchGlobaly,
      serachByCoordinator: searchByCoordinator,
   });
   // Get Scroll Top Btn To Scroll Top When Use Select A Tema
   const scrollTopBtn = useRef();
   const anchorLink = useRef(null);

   useEffect(() => {
      // If Student Or Admin => Getting All Doctors teme
      if (user && (userType === "student" || userType === "admin")) {
         dispatch(getAllTopicsByDoctor());
         // Set Default Search Method To Use It In Search Bar
         dispatch(setSearchMethod("searchGlobaly"));
      }
      // If Coordinator => Getting Only Doctor's teme
      else if (user && userType === "coordonator") {
         const doctorId =
            JSON.parse(user)?.coordonator?.id ||
            JSON.parse(user)?.corrdonator_id;
         if (doctorId) {
            dispatch(getTopicsByDoctorId(doctorId));
         }
      }
      if (userType === "student") {
         dispatch(getStudentStatus());
      }
   }, []);
   useEffect(() => {
      if (userType === "student") scrollTopBtn.current.click();
   }, [workspaceInfo]);

   // ======================= Router Hook =======================
   const navigate = useNavigate();

   // ======================= Handler =======================
   // Checking If User Select A Tema of Not
   const handleCreation = () => {
      if (workspaceInfo.tema_id && workspaceInfo.coordonator_id)
         confirmCreation(workspaceInfo);
      else processChecking("Please Select A Tema.", "warning", "red-bg");
   };

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
   // Checking Box To Confirm Creation A New Workspace
   const confirmCreation = async (workspace) => {
      try {
         let checkBox = await swal("Dumneavoastră sunteţi sigur?", {
            dangerMode: true,
            buttons: true,
         });
         if (checkBox) {
            await dispatch(createWorkspace(workspace)).unwrap();
            await processChecking("Process Successfully", "success", "done");
            navigate("/homepage");
         }
      } catch (err) {
         processChecking(err, "error", "red-bg");
      }
   };

   if (user) {
      if (userType === "student") {
         // Names Of Table Columns
         const tableCols = [
            { heading: "Nr", val: "" },
            { heading: "Temă", val: "title" },
            { heading: "Tip", val: "tema_type" },
            { heading: "Detalii", val: "detalii" },
            { heading: "Specializare", val: "specializare" },
            { heading: "Disponibilitate", val: "is_taken" },
            {
               heading: "Process",
               val: { select: true },
            },
         ];

         return (
            <>
               <Header userType={userType} />
               <main className="main list-of-topics-page">
                  <div className="container">
                     <Search searchMethod={theSearchMethod[searchMethod]} />
                     <Filter
                        coordinator={true}
                        programmingLang={true}
                        topicType={true}
                        searchMethod={searchGlobaly}
                     />
                     {userStatus?.workspace_status === 1 ||
                     userStatus?.workspace_status === 0 ? null : (
                        <div className="btns-space">
                           {workspace.loading ? (
                              <Spinning size="small" />
                           ) : (
                              <button
                                 className={`btn save-btn ${
                                    workspaceInfo.tema_id
                                       ? "save-btn-animation"
                                       : null
                                 }`}
                                 onClick={handleCreation}
                              >
                                 Salvare
                              </button>
                           )}
                        </div>
                     )}
                     {topicsByDoctor.length > 0
                        ? topicsByDoctor.map((doctor, i) => (
                             <div key={i} className="content">
                                <h2 className="title">
                                   {i + 1}. {doctor.name} ({doctor.email})
                                </h2>
                                <Table
                                   tableCols={tableCols}
                                   tableData={doctor.teme}
                                   resetPagination={resetPagination}
                                   msg="There Are No Teme To Show"
                                />
                             </div>
                          ))
                        : null}
                  </div>
                  <a href="#" className="scroll-top" ref={scrollTopBtn}>
                     <img
                        src={arrowUpIcon}
                        alt="arrow-up"
                        className="btn-icon"
                     />
                  </a>
               </main>
            </>
         );
      } else if (userType === "coordonator") {
         // Names Of Table Columns
         const tableCols = [
            { heading: "Nr", val: "" },
            { heading: "Tema", val: "title" },
            { heading: "Type", val: "tema_type" },
            { heading: "Detalii", val: "detalii" },
            { heading: "Domenii de inters", val: "specializare" },
         ];

         return (
            <>
               <Header userType={userType} />
               <main className="main list-of-topics-page">
                  <div className="container">
                     <Search searchMethod={searchGlobaly} />
                     <Filter
                        coordinator={false}
                        programmingLang={true}
                        topicType={true}
                        searchMethod={searchGlobaly}
                     />
                     <div className="content">
                        <h2 className="title">
                           Coordonator: {JSON.parse(user)?.name}
                        </h2>
                        <button
                           className="btn add-btn"
                           onClick={() => navigate("/profile/add-new-topic")}
                        >
                           Adăugare
                           <img
                              src={addIcon}
                              alt="btn-icon"
                              className="btn-icon"
                           />
                        </button>
                        <Table
                           tableCols={tableCols}
                           tableData={topicsByDoctor?.[0]?.teme || []}
                           resetPagination={resetPagination}
                           msg={
                              searchMode ? (
                                 "There Are No Matched Teme."
                              ) : (
                                 <p>
                                    Încă nu aveți nici-o temă propusă. Vă rugăm
                                    să clicați{" "}
                                    <Link
                                       to="/profile/add-new-topic"
                                       style={{
                                          textDecoration: "underLine",
                                          color: "blue",
                                          fontWeight: "bold",
                                       }}
                                    >
                                       Profil
                                    </Link>{" "}
                                    pentru adaugare o temă.
                                 </p>
                              )
                           }
                        />
                     </div>
                  </div>
               </main>
            </>
         );
      } else if (userType === "admin") {
         // Names Of Table Columns
         const tableCols = [
            { heading: "Nr", val: "" },
            { heading: "Tema", val: "title" },
            { heading: "Type", val: "tema_type" },
            { heading: "Detalii", val: "detalii" },
            { heading: "Specializare", val: "specializare" },
         ];

         return (
            <>
               <Header userType={userType} />
               <main className="main list-of-topics-page">
                  <div className="container">
                     <Search searchMethod={theSearchMethod[searchMethod]} />
                     <Filter
                        coordinator={true}
                        programmingLang={true}
                        topicType={true}
                        searchMethod={searchGlobaly}
                     />
                     <div className="btns-space">
                        <a
                           ref={anchorLink}
                           style={{
                              display: "none",
                           }}
                        ></a>
                        {exportProcess.loading ? (
                           <Spinning size="small" />
                        ) : (
                           <button
                              className="btn save-btn"
                              onClick={() => {
                                 dispatch(getCoordinatorTemeTable()).then(
                                    ({ payload }) => {
                                       const blob = new Blob([payload], {
                                          type: "octet-stream",
                                       });
                                       const href = URL.createObjectURL(blob);
                                       anchorLink.current.href = href;
                                       anchorLink.current.download =
                                          "lista_de_teme.csv";
                                       anchorLink.current.click();
                                       URL.revokeObjectURL(href);
                                    }
                                 );
                              }}
                           >
                              Export
                           </button>
                        )}
                     </div>
                     {topicsByDoctor.length > 0
                        ? topicsByDoctor.map((doctor, i) => (
                             <div key={i} className="content">
                                <h2 className="title">
                                   {i + 1}. {doctor.name} ({doctor.email})
                                   {/* (Coordonator ID: {doctor.id}) */}
                                </h2>
                                <Table
                                   tableCols={tableCols}
                                   tableData={doctor.teme}
                                   resetPagination={resetPagination}
                                   msg="There Are No Teme To Show"
                                />
                             </div>
                          ))
                        : null}
                  </div>
                  <a href="#" className="scroll-top" ref={scrollTopBtn}>
                     <img
                        src={arrowUpIcon}
                        alt="arrow-up"
                        className="btn-icon"
                     />
                  </a>
               </main>
            </>
         );
      } else {
         return <Navigate to="/" />;
      }
   } else {
      return <Navigate to="/" />;
   }
};

export default ListOfTopics;
