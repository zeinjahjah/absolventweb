// External
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// Internal
import Header from "../components/Header";
import Table from "../components/Table";
import UniversityLogo from "../components/UniversityLogo";
import addIcon from "../assets/imgs/icons/addIcon.png";
import { getTopicsByDoctorId } from "../redux/topics/topicsActions";

const Profile = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   const userDetail = JSON.parse(user);
   const userType = JSON.parse(user)?.type;
   document.title = "Absolventweb | Profile";

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const topicsByDoctor = useSelector((state) => state.topics.topicsByDoctor);

   // ======================= React Hook =======================
   useEffect(() => {
      if (user && userType === "coordonator") {
         const doctorId =
            JSON.parse(user)?.coordonator?.id ||
            JSON.parse(user)?.corrdonator_id;
         if (doctorId) dispatch(getTopicsByDoctorId(doctorId));
      }
   }, []);

   // ======================= Router Hook =======================
   const navigate = useNavigate();

   // ======================= User Details Showing In Profile Page =======================
   // This Trick Because Response Deal Admin Like Coordonator
   let userProfile = "student";
   let label = "Specializare";
   if (userType === "admin" || userType === "coordonator")
      userProfile = "coordonator";

   if (userType === "coordonator") label = "Domenii de inters";

   const userDetails = [
      { heading: "Tipul utilizator", val: "type" },
      { heading: "Numele şi prenumele", val: "name" },
      { heading: "Email", val: "email" },
      // { heading: "Telefon", val: `${userProfile}.phone` },
      // { heading: "Facultatea", val: `${userProfile}.facultatea` },
      {
         heading: label,
         val: `${userProfile}.specializare`,
      },
   ];

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
      // Names Of Table Columns
      const tableCols = [
         { heading: "Nr", val: "" },
         { heading: "Temă", val: "title" },
         { heading: "Tip", val: "tema_type" },
         { heading: "Detalii", val: "detalii" },
         { heading: "Specializare", val: "specializare" },
         {
            heading: "Process",
            val: { edite: true, delete: true },
         },
      ];

      return (
         <>
            <Header userType={userType} />
            <main
               className={`main profile-page ${
                  userType === "student" || userType === "admin"
                     ? "profile-student"
                     : ""
               }`}
            >
               <section className="section user-info">
                  <div className="container">
                     <ul className="detils">
                        {userDetails.map((userInfo, i) => {
                           // Checking If User Type Is An Admin To Remove Specializare
                           if (
                              userType === "admin" &&
                              userInfo.heading === "Specializare"
                           )
                              return;
                           // Checking If Object Has Nested Object To Extract it
                           if (userInfo.val.includes(".")) {
                              const arr = userInfo.val.split(".");
                              return (
                                 <li key={i} className="item">
                                    <h3 className="title">
                                       {userInfo.heading}:
                                    </h3>
                                    <p className="text">
                                       {userDetail?.[arr[0]]?.[arr[1]] ||
                                          "No Data"}
                                    </p>
                                 </li>
                              );
                           } else {
                              return (
                                 <li key={i} className="item">
                                    <h3 className="title">
                                       {userInfo.heading}:
                                    </h3>
                                    <p className="text">
                                       {userDetail[userInfo.val]}
                                    </p>
                                 </li>
                              );
                           }
                        })}
                     </ul>
                     <UniversityLogo />
                  </div>
               </section>
               {userType === "coordonator" ? (
                  <section className="section topics">
                     <div className="container">
                        <Table
                           tableCols={tableCols}
                           tableData={topicsByDoctor?.[0]?.teme || []}
                           resetPagination={resetPagination}
                           msg="You Don't Any Tema Yet."
                        />
                     </div>
                  </section>
               ) : null}
            </main>
         </>
      );
   } else {
      return <Navigate to="/" />;
   }
};

export default Profile;
