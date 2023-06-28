import { Link } from "react-router-dom";

export const Logo = () => {
   return (
      <Link to="/" className="site-logo">
         <span className="logo-text">AbsolventWeb</span>
      </Link>
   );
};
