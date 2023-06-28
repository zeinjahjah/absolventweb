// External
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Filter from "../components/Filter";
// Internal
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Search from "../components/Search";
import Spinning from "../components/Spinning";
import Table from "../components/Table";
import UniversityLogo from "../components/UniversityLogo";
import { getStudentsOfCoordinatorTable } from "../redux/export/exportActions";
import { setSearchMethod } from "../redux/global/globalSlice";
import { searchGlobaly } from "../redux/topics/topicsSlice";
import { getAcceptedStudent } from "../redux/users/uersAction";
import {
   searchCoordinators,
   searchStudent,
   searchTema,
} from "../redux/users/usersSlice";

const Doctors = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;
   document.title = "Absolventweb | Coordonator";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const acceptedStudent = useSelector((state) => state.users.acceptedStudent);
   // Use This To Get Selected Search Method
   const searchMethod = useSelector((state) => state.global.searchMethod);
   const exportProcess = useSelector((state) => state.export);

   // ======================= React Hook =======================
   // Specify Search Method To Send It To Search Compnent
   const [theSearchMethod, setTheSearchMethod] = useState({
      searchCoordinators: searchCoordinators,
      searchStudent: searchStudent,
      searchTema: searchTema,
   });
   // Store Pagination Values For All Page.
   const [paginationValue, setPaginationValue] = useState({
      start: 0,
      end: 3,
   });
   const anchorLink = useRef(null);
   useEffect(() => {
      if (user && userType === "admin") {
         dispatch(getAcceptedStudent());
         // Set Default Search Method To Use It In Search Bar
         dispatch(setSearchMethod("searchCoordinators"));
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
      setPaginationValue({
         start: 0,
         end: 3,
      });
   };

   if (user) {
      if (userType === "admin") {
         // Names Of Table Columns
         const tableCols = [
            { heading: "Nr", val: "" },
            { heading: "Workspace ID", val: "workspace_id" },
            { heading: "Student", val: "name" },
            { heading: "Tema", val: "tema" },
         ];

         return (
            <>
               <Header userType={userType} />
               <main className="main doctors-page">
                  <div className="container">
                     <div className="content">
                        <Search searchMethod={theSearchMethod[searchMethod]} />
                        <Filter
                           student={true}
                           tema={true}
                           searchMethod={searchGlobaly}
                        />
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
                                 dispatch(getStudentsOfCoordinatorTable()).then(
                                    ({ payload }) => {
                                       const blob = new Blob([payload], {
                                          type: "octet-stream",
                                       });
                                       const href = URL.createObjectURL(blob);
                                       anchorLink.current.href = href;
                                       anchorLink.current.download =
                                          "Studentii_coordonatorilor.csv";
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
                     <div className="content">
                        {acceptedStudent
                           ? acceptedStudent
                                .map((doctor, i) => (
                                   <div className="box" key={i}>
                                      <h2 className="title">
                                         {i + 1}. {doctor.name}
                                      </h2>
                                      <Table
                                         tableCols={tableCols}
                                         tableData={doctor.students}
                                         resetPagination={resetPagination}
                                         msg="There Are No Students To Show."
                                      />
                                   </div>
                                ))
                                .slice(
                                   paginationValue.start,
                                   paginationValue.end
                                )
                           : null}
                     </div>
                  </div>
                  <Pagination
                     paginationCount={acceptedStudent.length}
                     setPaginationValue={setPaginationValue}
                  />
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

export default Doctors;
