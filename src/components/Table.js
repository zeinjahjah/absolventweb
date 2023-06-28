// External
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { seBtnProcess } from "../redux/global/globalSlice";
// Internal
import Pagination from "./Pagination";
import TableProcess from "./TableProcess";
import linkIcon from "../assets/imgs/icons/linkIcon.png";

const Table = ({ tableCols, tableData, resetPagination, msg }) => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userType = JSON.parse(user)?.type;

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const searchMode = useSelector((state) => state.global.searchMode);
   const topics = useSelector((state) => state.topics);
   const workspace = useSelector((state) => state.workspaces);
   // This Object Contain Buttons Status => Use It To Handle Prevent Show Alert Unless Exactly Operation
   const btnProcess = useSelector((state) => state.global.btnProcess);

   // ======================= Reacts Hook =======================
   // Pagination Value For The Table
   const [paginationValueTable, setPaginationValueTable] = useState({
      start: 0,
      end: 3,
   });

   useEffect(() => {
      // Checking If Serach Mode Ture To Reset Pagination To Start Point
      if (searchMode) resetPagination(setPaginationValueTable);
   }, [searchMode]);

   useEffect(() => {
      if (userType === "coordonator") {
         // For Alert Delete Tema Operation
         if (!topics.loading & btnProcess.deleteTema) {
            if (topics.success)
               processChecking("Process Successfully", "success", "done");
            else if (topics.error)
               processChecking(topics.error, "error", "red-bg");
            dispatch(seBtnProcess({ deleteTema: false })); // Reset
         }
         // For Alert To Accept Or Reject A Student Operation
         if (
            !workspace.loading &&
            (btnProcess.acceptStudent || btnProcess.rejectStudent)
         ) {
            if (workspace.success)
               processChecking("Process Successfully", "success", "done");
            else if (workspace.error)
               processChecking(workspace.error, "error", "red-bg");
            dispatch(
               seBtnProcess({ acceptStudent: false, rejectStudent: false })
            ); // Reset
         }
      }
   }, [topics.loading, workspace.loading]);

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

   return (
      <>
         <div className="cover">
            <table className="table" style={{ whiteSpace: "pre-wrap" }}>
               <thead className="thead">
                  <tr className="main-row">
                     {tableCols.map((colName, i) => (
                        <th key={i} className="main-cell">
                           {colName.heading}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="tbody">
                  {tableData.length > 0 ? (
                     tableData
                        .map((item, i) => {
                           return (
                              <tr key={i} className="row">
                                 {tableCols.map((cell, j) => {
                                    if (cell.heading === "Nr")
                                       return (
                                          <td className="cell" key={j}>
                                             {i + 1}.
                                          </td>
                                       );
                                    if (cell.heading === "Disponibilitate") {
                                       return (
                                          <td
                                             className="cell jj"
                                             style={{ textAlign: "center" }}
                                             key={j}
                                             dangerouslySetInnerHTML={{
                                                __html:
                                                   item[cell.val] == 1
                                                      ? "Indisponibil"
                                                      : "Disponibil",
                                             }}
                                          ></td>
                                       );
                                    }
                                    if (cell.heading === "Process") {
                                       return (
                                          <td className="cell" key={j}>
                                             <TableProcess
                                                process={cell.val}
                                                selectionInfo={{
                                                   tema_id: item?.id || null,
                                                   coordonator_id:
                                                      item?.coordonator_id ||
                                                      null,
                                                   is_taken:
                                                      item.is_taken || null,
                                                }}
                                                workspaceInfo={{
                                                   student_id:
                                                      item?.student?.id || null,
                                                   student_email:
                                                      item?.student?.email ||
                                                      null,
                                                   workspace_id:
                                                      item?.worspace_id || null,
                                                   tema_name:
                                                      item?.tema?.title || null,
                                                }}
                                                temaId={item?.id || null}
                                             />
                                          </td>
                                       );
                                    }
                                    if (
                                       cell.heading === "Statutul De Student"
                                    ) {
                                       return (
                                          <td className="cell" key={j}>
                                             <TableProcess
                                                process={cell.val}
                                                workspaceId={
                                                   item?.worspace_id || null
                                                }
                                             />
                                          </td>
                                       );
                                    }
                                    if (cell?.process?.link) {
                                       return (
                                          <td className="cell" key={j}>
                                             <TableProcess
                                                process={cell.process}
                                                eventType={
                                                   item.type || "No Type"
                                                }
                                                eventTitle={
                                                   item.title || "No Title"
                                                }
                                                eventId={item.id || null}
                                             />
                                          </td>
                                       );
                                    }
                                    if (cell.heading === "Attachment") {
                                       if (item.attachment) {
                                          return (
                                             <td className="cell" key={j}>
                                                <TableProcess
                                                   process={cell.process}
                                                   eventId={item.id || null}
                                                   fileName={
                                                      item.attachment.file_name
                                                   }
                                                />
                                             </td>
                                          );
                                       } else if (item.type === "meeting") {
                                          return (
                                             <td className="cell" key={j}>
                                                <a
                                                   href={item.descriere}
                                                   target="_blank"
                                                >
                                                   <img
                                                      src={linkIcon}
                                                      alt="Link-Icon"
                                                   />
                                                </a>
                                             </td>
                                          );
                                       } else {
                                          return (
                                             <td className="cell" key={j}>
                                                No File
                                             </td>
                                          );
                                       }
                                    }
                                    // Checking If Object Has Nested Object To Extract it
                                    if (
                                       typeof cell.val == "string" &&
                                       cell.val.includes(".")
                                    ) {
                                       const arr = cell.val.split(".");

                                       return (
                                          <td
                                             className="cell"
                                             key={j}
                                             dangerouslySetInnerHTML={{
                                                __html: item[arr[0]][arr[1]],
                                             }}
                                          ></td>
                                       );
                                    } else {
                                       return (
                                          <td
                                             className="cell"
                                             key={j}
                                             dangerouslySetInnerHTML={{
                                                __html: item[cell.val],
                                             }}
                                          ></td>
                                       );
                                    }
                                 })}
                              </tr>
                           );
                        })
                        .slice(
                           paginationValueTable.start,
                           paginationValueTable.end
                        )
                  ) : (
                     <tr className="row">
                        <td
                           className="cell empty-table"
                           colSpan={tableCols.length}
                        >
                           {msg}
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         <Pagination
            paginationCount={tableData.length}
            setPaginationValue={setPaginationValueTable}
         />
      </>
   );
};

export default Table;
