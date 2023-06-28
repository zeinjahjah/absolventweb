// External
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
// Internal
import phoneIcon from "../assets/imgs/icons/phoneIcon.png";
import addressIcon from "../assets/imgs/icons/addressIcon.png";
import mailIcon from "../assets/imgs/icons/mailIcon.png";
import lockIcon from "../assets/imgs/icons/lockIcon.png";
import { Logo } from "../components/Logo";
import UniversityLogo from "../components/UniversityLogo";
import Spinning from "../components/Spinning";
import { registerUser } from "../redux/auth/authActions";

const Register = () => {
   // ======================= Global Data =======================
   // Get User Information To Permission For Enter This Page Or Not
   const user = localStorage.getItem("user");
   // Set Page Title
   document.title = "Absolventweb | Register";

   // ======================= Select Input Elements =======================
   const userTypeSelect = useRef(null);
   const nameInput = useRef(null);
   const emailInput = useRef(null);
   const passwordInput = useRef(null);
   const passwordConFirmInput = useRef(null);
   // const phoneInput = useRef(null);
   // const addressInput = useRef(null);
   // const facultyInput = useRef(null);
   const specializareInput = useRef(null);

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();
   const userInfo = useSelector((state) => state.auth);

   // ======================= React Hook =======================
   // Store Selected User Type
   const [selectedType, setSelectedType] = useState(null);
   // User Types
   const userTypes = ["student", "coordonator", "admin"];
   // To Prevent useEffect Run Initial-Render
   const firstUpdate = useRef(true);

   useEffect(() => {
      if (!user) nameInput.current.focus();
   }, []);
   // ############## Alert Logic ##############
   useEffect(() => {
      if (firstUpdate.current) {
         firstUpdate.current = false;
         return;
      }
      if (!userInfo.loading && userInfo.error) {
         processChecking(userInfo.error, "error", "red-bg");
      } else if (!userInfo.loading && userInfo.success) {
         processChecking("Register Success", "success", "done").then(() =>
            navigate("/homepage", { replace: true })
         );
      }
   }, [userInfo.error, userInfo.success]);

   // ======================= Router Hook =======================
   const navigate = useNavigate();

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

   // ======================= Vaidation =======================
   const fieldsValidation = (userInput) => {
      const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!Object.values(userInput).every((e) => e !== "")) {
         processChecking("Please Fill All Fields.", "warning", "red-bg");
      } else if (!emailValidation.test(userInput.email)) {
         processChecking(
            "You Have Entered An Invalid Email Address.",
            "warning",
            "red-bg"
         );
      } else if (userInput.password.length < 6) {
         processChecking("Your Password Is Too Short.", "warning", "red-bg");
      } else if (userInput.password !== userInput["password_confirmation"]) {
         processChecking("Passwords Are Not Identical.", "warning", "red-bg");
      } else {
         return true;
      }
   };

   // ======================= Handle Request =======================
   const handleRegister = (e) => {
      e.preventDefault();
      const userRegisterInfo = {
         name: nameInput.current.value,
         email: emailInput.current.value,
         type: selectedType,
         password: passwordInput.current.value,
         password_confirmation: passwordConFirmInput.current.value,
         // phone: phoneInput.current.value,
         // address: addressInput.current.value,
         // facultatea: facultyInput.current.value,
      };
      // Add Specializare For All Users Except Admin
      if (userTypes[selectedType] !== "admin")
         userRegisterInfo.specializare = specializareInput.current.value;

      // Add is_admin Value For Admin And Coordonator
      if (userTypes[selectedType] === "admin") userRegisterInfo["is_admin"] = 1;
      else if (userTypes[selectedType] === "coordonator")
         userRegisterInfo["is_admin"] = 0;

      if (fieldsValidation(userRegisterInfo)) {
         dispatch(registerUser(userRegisterInfo));
      }
   };

   if (user) {
      return <Navigate to="/homepage" replace={true} />;
   } else {
      return (
         <div className="auth">
            <div className="container">
               <div className="content">
                  <div className="form">
                     <Logo />
                     <form className="form-element">
                        <div className="form-group">
                           <label>Tipul utilizator</label>
                           <div
                              className="custom-select"
                              onClick={(_) =>
                                 userTypeSelect.current.classList.toggle(
                                    "show-options"
                                 )
                              }
                           >
                              {selectedType !== null
                                 ? userTypes[selectedType]
                                 : "Select type"}
                              <span className="arrow"></span>
                              <ul className="select" ref={userTypeSelect}>
                                 {userTypes.map((e, i) => {
                                    return (
                                       <li
                                          key={i}
                                          className="option"
                                          onClick={(_) => setSelectedType(i)}
                                       >
                                          {e}
                                       </li>
                                    );
                                 })}
                              </ul>
                           </div>
                        </div>
                        <div className="form-group">
                           <label htmlFor="username">
                              Prenume și nume
                           </label>
                           <input
                              type="text"
                              className="form-input"
                              required
                              id="username"
                              placeholder="Write here"
                              ref={nameInput}
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="email">Email utilizatorului</label>
                           <div className="img-input">
                              <img src={mailIcon} alt="mail-icon" />
                           </div>
                           <input
                              type="email"
                              className="form-input"
                              required
                              id="email"
                              placeholder="Write here"
                              ref={emailInput}
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="password">Parola</label>
                           <div className="img-input">
                              <img src={lockIcon} alt="lock-icon" />
                           </div>
                           <input
                              type="password"
                              className="form-input"
                              required
                              id="password"
                              placeholder="Write here"
                              ref={passwordInput}
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="password-confirm">
                              Confirmarea parolei
                           </label>
                           <div className="img-input">
                              <img src={lockIcon} alt="lock-icon" />
                           </div>
                           <input
                              type="password"
                              className="form-input"
                              required
                              id="password-confirm"
                              placeholder="Write here"
                              ref={passwordConFirmInput}
                           />
                        </div>
                        {/* <div className="form-group">
                           <label htmlFor="phone">Phone</label>
                           <div className="img-input">
                              <img src={phoneIcon} alt="phone-icon" />
                           </div>
                           <input
                              type="number"
                              className="form-input"
                              required
                              id="phone"
                              placeholder="Write here"
                              ref={phoneInput}
                           />
                        </div> */}
                        {/* <div className="form-group">
                           <label htmlFor="address">Address</label>
                           <div className="img-input">
                              <img src={addressIcon} alt="address-icon" />
                           </div>
                           <input
                              type="text"
                              className="form-input"
                              required
                              id="address"
                              placeholder="Write here"
                              ref={addressInput}
                           />
                        </div> */}
                        {/* <div className="form-group">
                           <label htmlFor="facultatea">Facultatea</label>
                           <input
                              type="text"
                              className="form-input"
                              required
                              id="facultatea"
                              placeholder="Write here"
                              ref={facultyInput}
                           />
                        </div> */}
                        {userTypes[selectedType] === "coordonator" ?  (
                           <div className="form-group">
                              <label htmlFor="specializare">Domenii de inters</label>
                              <input
                                 type="text"
                                 className="form-input"
                                 required
                                 id="specializare"
                                 placeholder="Write here"
                                 ref={specializareInput}
                              />
                           </div>
                        ) : null}

                        {userTypes[selectedType] === "student" ? (
                           <div className="form-group">
                              <label htmlFor="specializare">Specializare</label>
                              <input
                                 type="text"
                                 className="form-input"
                                 required
                                 id="specializare"
                                 placeholder="Write here"
                                 ref={specializareInput}
                              />
                           </div>
                        ) :  null }

                        {userInfo.loading ? (
                           <Spinning size="full" />
                        ) : (
                           <button
                              type="submit"
                              className="btn auth-page-btn"
                              onClick={handleRegister}
                           >
                              Inregistrare
                           </button>
                        )}
                        <p className="note">
                           Aveți deja un cont?{" "}
                           <Link to="/login" className="link">
                              Logare
                           </Link>
                        </p>
                     </form>
                  </div>
                  <UniversityLogo />
               </div>
            </div>
         </div>
      );
   }
};

export default Register;
