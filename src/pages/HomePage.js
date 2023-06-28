// External
import { Link, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// Internal
import stepsIcon from "../assets/imgs/icons/stepsIcon.png";
import statusIcon from "../assets/imgs/icons/statusIcon.png";
import Header from "../components/Header";
import Search from "../components/Search";
import Filter from "../components/Filter";
import Table from "../components/Table";
import Spinning from "../components/Spinning";
import UniversityLogo from "../components/UniversityLogo";
import { getWaitingWorkspace } from "../redux/workspaces/workspacesActions";
import { getStudents, getStudentStatus } from "../redux/users/uersAction";
import { searchByName, searchTipTema } from "../redux/users/usersSlice";
import { getTemeTable } from "../redux/export/exportActions";
import { getAllCoordinatorEvent } from "../redux/events/eventsAction";

const HomePage = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   document.title = "Absolventweb | Acasă";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const waitingWorkspaces = useSelector(
      (state) => state.workspaces.waitingWorkspaces
   );
   const coordinatorEvents = useSelector(
      (state) => state.events.coordinatorEvents
   );
   const userStatus = useSelector((state) => state.users.studentStatus);
   const students = useSelector((state) => state.users.students).filter(
      (student) => student?.workspace?.status === 1
   );
   const exportProcess = useSelector((state) => state.export);

   // ======================= React Hook =======================
   const anchorLink = useRef(null);
   useEffect(() => {
      if (userType === "student") dispatch(getStudentStatus());
      else if (userType === "coordonator") {
         dispatch(getWaitingWorkspace());
         dispatch(getAllCoordinatorEvent());
      } else if (userType === "admin") dispatch(getStudents());
   }, []);

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

   if (user) {
      if (userType === "student") {
         return (
            <>
               <Header userType={userType} />
               <main className="main homepage-student">
                  <div className="container">
                     <div className="content">
                        <h2 className="title">Etapele lucrării</h2>
                        <ul className="steps">
                           <li className="step">
                              <img
                                 src={stepsIcon}
                                 alt="steps-icon"
                                 className="icon"
                              />
                              <p>
                                 Alegere o temă din {""}
                                 <Link to="/list-of-topics" className="link">
                                    lista propunerilor
                                 </Link>{" "}
                                 {""}
                                 de lucrări de licență.
                              </p>
                           </li>
                           {typeof userStatus?.workspace_status === "number" ? (
                              <>
                                 <li className="step">
                                    <img
                                       src={statusIcon}
                                       alt="status-icon"
                                       className="icon"
                                    />
                                    status acceptare
                                 </li>
                                 <li className="student-status">
                                    {userStatus?.workspace_status === 0 ? (
                                       <span className="pending status">
                                          În aşteptare
                                       </span>
                                    ) : null}
                                    {userStatus?.workspace_status === 1 ? (
                                       <span className="accepted status">
                                          Acceptat
                                       </span>
                                    ) : null}
                                    {userStatus?.workspace_status === 3 ? (
                                       <span className="rejected status">
                                          Respins
                                       </span>
                                    ) : null}
                                 </li>
                              </>
                           ) : null}
                        </ul>
                     </div>
                     <UniversityLogo />
                  </div>
               </main>
            </>
         );
      } else if (userType === "coordonator") {
         // Names Of Table Columns
         const tableCols1 = [
            { heading: "Nr", val: "" },
            { heading: "Student", val: "student.email" },
            { heading: "Titlul Lucrării", val: "tema.title" },
            { heading: "Specializare", val: "tema.specializare" },
            {
               heading: "Statutul De Student",
               val: { acceptBtn: true, rejectBtn: true },
            },
         ];

         // Names Of Table Columns
         const tableCols2 = [
            { heading: "Nr", val: "" },
            { heading: "Student", val: "student_name" },
            { heading: "Title", val: "event_title" },
            { heading: "Deadline", val: "event_deadline" },
         ];

         return (
            <>
               <Header userType={userType} />
               <main className="main homepage-coordonator">
                  <div className="container">
                     <div className="content">
                        <div className="title">
                           <img
                              src={statusIcon}
                              alt="status-icon"
                              className="icon"
                           />
                           <p className="text">Studenților în așteptare</p>
                        </div>
                        {waitingWorkspaces ? (
                           <Table
                              tableCols={tableCols1}
                              tableData={waitingWorkspaces}
                              resetPagination={resetPagination}
                              msg="You Don't Have Any Request."
                           />
                        ) : null}
                     </div>
                     <div className="content">
                        <div className="title">
                           <img
                              src={stepsIcon}
                              alt="steps-icon"
                              className="icon"
                           />
                           <p className="text">Sarcinile tale</p>
                        </div>
                        {[] ? (
                           <Table
                              tableCols={tableCols2}
                              tableData={coordinatorEvents}
                              resetPagination={resetPagination}
                              msg="You Don't Have Any Event Yet."
                           />
                        ) : null}
                     </div>
                  </div>
               </main>
            </>
         );
      } else if (userType === "admin") {
         // Names Of Table Columns
         const tableCols = [
            { heading: "Nr", val: "" },
            { heading: "Student Id", val: "id" },
            { heading: "Student", val: "student_name" },
            { heading: "Student Email", val: "email" },
            { heading: "Coordonator", val: "coordonator.coordinator_name" },
            { heading: "Coordonator Email", val: "coordonator.email" },
            { heading: "Titlul Temei", val: "tema.title" },
         ];
         return (
            <>
               <Header userType={userType} />
               <main className="main homepage-admin">
                  <div className="container">
                     <div className="content">
                        <div className="box">
                           <Search searchMethod={searchByName} />
                           {/* <Filter
                              topicType={true}
                              searchMethod={searchTipTema}
                           /> */}
                        </div>
                        {/* <UniversityLogo /> */}
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
                                    dispatch(getTemeTable()).then(
                                       ({ payload }) => {
                                          const blob = new Blob([payload], {
                                             type: "octet-stream",
                                          });
                                          const href =
                                             URL.createObjectURL(blob);
                                          anchorLink.current.href = href;
                                          anchorLink.current.download =
                                             "Detalii_studenti_acceptati.csv";
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
                        <div className="box">
                           <h2 className="title">
                           Detalii despre lucrari de licenţă acceptate pentru toţi studenţii
                        
                           </h2>
                           {students ? (
                              <Table
                                 tableCols={tableCols}
                                 tableData={students}
                                 resetPagination={resetPagination}
                                 msg="There Are No Data To Show."
                              />
                           ) : null}
                        </div>
                     </div>
                  </div>
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

export default HomePage;
