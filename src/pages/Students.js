// External
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// Internal
import studentsIcon from "../assets/imgs/icons/studentsIcon.png";
import userOutIcon from "../assets/imgs/icons/userOutIcon.png";
import userRejectedIcon from "../assets/imgs/icons/userRejectedIcon.png";
import Header from "../components/Header";
import Search from "../components/Search";
import Spinning from "../components/Spinning";
import Table from "../components/Table";
import UniversityLogo from "../components/UniversityLogo";
import { getStudentsStatusTable } from "../redux/export/exportActions";
import { getStudents } from "../redux/users/uersAction";
import { searchStudentPage } from "../redux/users/usersSlice";
import { getAcceptedWorkspace } from "../redux/workspaces/workspacesActions";

const Students = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   document.title = "Absolventweb | Studenți";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const acceptedWorkspaces = useSelector(
      (state) => state.workspaces.acceptedWorkspaces
   );
   const students = useSelector((state) => state.users.students);
   const StudentLaAsteptatre = students.filter(
      (student) => student?.workspace?.status === 0
   );
   const haveNotSelectedTema = students.filter((student) => !student.workspace);
   const exportProcess = useSelector((state) => state.export);

   // ======================= React Hook =======================
   const anchorLink = useRef(null);
   useEffect(() => {
      if (userType === "coordonator") {
         dispatch(getAcceptedWorkspace({}));
      } else if (userType === "admin") {
         dispatch(getStudents());
      }
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
      if (userType === "coordonator") {
         // Names Of Table Columns
         const tableCols = [
            { heading: "Nr", val: "" },
            { heading: "Student", val: "student.email" },
            { heading: "Titlul Lucrării", val: "tema.title" },
            { heading: "Specializare", val: "student.specializare" },
            {
               heading: "Process",
               val: { show: true },
            },
         ];

         return (
            <>
               <Header userType={userType} />
               <main className="main students-page-coordonator">
                  <div className="container">
                     <div className="content">
                        <div className="title">
                           <img
                              src={studentsIcon}
                              alt="students-icon"
                              className="icon"
                           />
                           <p className="text">Studenți</p>
                        </div>
                        {acceptedWorkspaces ? (
                           <Table
                              tableCols={tableCols}
                              tableData={acceptedWorkspaces}
                              resetPagination={resetPagination}
                              msg="There Are No Students To Show."
                           />
                        ) : null}
                     </div>
                     <UniversityLogo />
                  </div>
               </main>
            </>
         );
      } else if (userType === "admin") {
         // Names Of Table Columns
         const tableCols = [
            { heading: "Studenți ID", val: "id" },
            { heading: "Studenți", val: "student_name" },
            { heading: "Studenți Email", val: "email" },
            { heading: "Specializare", val: "specializare" },
         ];
         return (
            <>
               <Header userType={userType} />
               <main className="main students-page-admin">
                  <div className="container">
                     <Search searchMethod={searchStudentPage} />
                     <div className="content">
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
                                    dispatch(getStudentsStatusTable()).then(
                                       ({ payload }) => {
                                          const blob = new Blob([payload], {
                                             type: "octet-stream",
                                          });
                                          const href =
                                             URL.createObjectURL(blob);
                                          anchorLink.current.href = href;
                                          anchorLink.current.download =
                                             "Statutul_de_studenti.csv";
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
                           <div className="title">
                              <img
                                 src={userRejectedIcon}
                                 alt="status-icon"
                                 className="icon"
                              />
                              <p className="text">Studenților în așteptare</p>
                           </div>
                           {StudentLaAsteptatre ? (
                              <Table
                                 tableCols={tableCols}
                                 tableData={StudentLaAsteptatre}
                                 resetPagination={resetPagination}
                                 msg="There Are No Data To Show."
                              />
                           ) : null}
                        </div>
                        <div className="box">
                           <div className="title">
                              <img
                                 src={userOutIcon}
                                 alt="status-icon"
                                 className="icon"
                              />
                              <p className="text">
                                 Studenți care nu au selectat o temă sau
                                 respinși
                              </p>
                           </div>
                           {haveNotSelectedTema ? (
                              <Table
                                 tableCols={tableCols}
                                 tableData={haveNotSelectedTema}
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
         return <Navigate to="/homepage" />;
      }
   } else {
      return <Navigate to="/" />;
   }
};

export default Students;
