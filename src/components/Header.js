import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import logoutIcon from "../assets/imgs/icons/logoutIcon.png";
import { navLinks } from "../data/navlLinks";
import { Logo } from "./Logo";
import { userLogout } from "../redux/auth/authActions";
import Spinning from "./Spinning";
import swal from "sweetalert";

const Header = ({ userType, hideLinks }) => {
   const [toggleMenu, setToggleMenu] = useState(false);
   const headerElement = useRef(null);

   // Redux Hook
   const dispatch = useDispatch();
   const userInfo = useSelector((state) => state.auth);

   // Router Hook
   const navigate = useNavigate();

   // Sweet alert labrary
   const processChecking = async (msg, icon, theClassName) => {
      await swal(msg, {
         buttons: false,
         timer: 3000,
         icon: icon,
         className: theClassName,
         closeOnEsc: false,
      });
   };

   // Add scoll-header class to show shadow on the navbar border bottom
   window.onscroll = () => {
      if (headerElement.current) {
         const ele = headerElement.current;
         window.scrollY > 25
            ? ele.classList.add("scroll-header")
            : ele.classList.remove("scroll-header");
      }
   };
   useEffect(() => {
      if (userInfo.isLoggingOut) {
         navigate("/", { replace: true });
         window.location.reload();
      }
   }, [userInfo.isLoggingOut]);

   return (
      <header className="header" ref={headerElement}>
         <nav className="nav container">
            <Logo />
            {hideLinks ? null : (
               <div className="menu">
                  <ul className={`links ${toggleMenu ? "show" : ""}`}>
                     {navLinks[userType].map((e, i) => (
                        <li key={i} className="item">
                           <NavLink to={e.path} end>
                              {e.title}
                           </NavLink>
                        </li>
                     ))}
                     <li>
                        {userInfo.loading ? (
                           <Spinning size="full" />
                        ) : (
                           <button
                              className="btn logout-btn"
                              onClick={(_) => {
                                 dispatch(userLogout())
                                    .unwrap()
                                    .then(() =>
                                       processChecking(
                                          "Logging out Success",
                                          "success",
                                          "done"
                                       )
                                    );
                              }}
                           >
                              Logout
                              <img
                                 src={logoutIcon}
                                 alt="btn-icon"
                                 className="btn-icon"
                              />
                           </button>
                        )}
                     </li>
                  </ul>
                  <div
                     className={`toggle-mobile ${toggleMenu ? "close" : ""}`}
                     onClick={(_) => {
                        toggleMenu ? setToggleMenu(false) : setToggleMenu(true);
                     }}
                  >
                     <span className="toggle-mobile__span"></span>
                     <span className="toggle-mobile__span"></span>
                     <span className="toggle-mobile__span"></span>
                  </div>
               </div>
            )}
         </nav>
      </header>
   );
};

export default Header;
