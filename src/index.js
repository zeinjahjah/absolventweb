import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import axios from "axios";

// Axios Config
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.interceptors.response.use(
   (response) => response,
   (error) => {
      if (
         error.response.status === 401 ||
         error.response.data.message === "Unauthenticated."
      ) {
         window.location.href = "/login";
         localStorage.clear();
      }
      return Promise.reject(error);
   }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   // <React.StrictMode>
   <Provider store={store}>
      <Router>
         <App />
      </Router>
   </Provider>
   // {/* </React.StrictMode> */}
);
