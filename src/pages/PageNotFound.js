import { Link } from "react-router-dom";
import UniversityLogo from "../components/UniversityLogo";

const PageNotFound = () => {
   return (
      <div className="not-found">
         <div className="container">
            <UniversityLogo />
            <span className="error-number">404</span>
            <p className="text">
               The requestd URL{" "}
               <span className="error-href">{window.location.href}</span> was
               not found on this server.
            </p>
            <Link to="/" replace={false} className="btn retrun-btn">
               Home Page
            </Link>
         </div>
      </div>
   );
};

export default PageNotFound;
