import Header from "../components/Header";
import loginIcon from "../assets/imgs/icons/loginIcon.png";
import registerIcon from "../assets/imgs/icons/registerIcon.png";
import { Link, Navigate } from "react-router-dom";
import UniversityLogo from "../components/UniversityLogo";
import { greetingPageContent } from "../data/globalDate";
import { greetingPageContent3 } from "../data/globalDate";

const Greeting = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   document.title = "Absolventweb | Greeting";

   if (user) {
      return <Navigate to="/homepage" />;
   } else {
      return (
         <>
            <Header hideLinks={true} />
            <main className="main greeting-page">
               <div className="container">
                  <div className="content">
                     <p className="greeting-msg">
                        {greetingPageContent.message}
                     </p>
                     <p className="website-info">
                        {greetingPageContent.about_website}<br></br> <br></br>
                        {greetingPageContent3.test}
                     </p>
                     <div className="auth-btn">
                        <Link to="/login" className="btn login-btn">
                           Login
                           <img
                              src={registerIcon}
                              alt="btn-icon"
                              className="btn-icon"
                           />
                        </Link>
                        <p>OR</p>
                        <Link to="/register" className="btn register-btn">
                           Register
                           <img
                              src={loginIcon}
                              alt="btn-icon"
                              className="btn-icon"
                           />
                        </Link>
                     </div>
                  </div>
                  <UniversityLogo />
               </div>
            </main>
         </>
      );
   }
};

export default Greeting;
