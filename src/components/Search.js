// External
import { useRef } from "react";
import { useDispatch } from "react-redux";
// Internal
import searchIcon from "../assets/imgs/icons/searchIcon.png";
import { setSearchMode } from "../redux/global/globalSlice";

const Search = ({ searchMethod }) => {
   // ======================= Select Input Elements =======================
   const serachInput = useRef(null);

   // ======================= Redux Hook =======================
   const dispatch = useDispatch();

   return (
      <div className="search">
         <h3 className="search_title">Cautare</h3>
         <div className="search_field">
            <input
               type="search"
               placeholder="Search"
               className="search_field_input"
               ref={serachInput}
               onInput={(e) => {
                  // Making Search Mode Ture To Reset All Pagination To Start Point
                  dispatch(setSearchMode(true));
                  if (e.target.value === "") {
                     // Making Search Mode False To Reset All Pagination To Start Point
                     dispatch(setSearchMode(false));
                     // When Input Is Empty Reset Data In Table
                     dispatch(searchMethod(e.target.value));
                  }
               }}
            />
            <div
               className="icon"
               onClick={() => {
                  dispatch(searchMethod(serachInput.current.value));
               }}
            >
               <img src={searchIcon} alt="search-icon" className="btn-icon" />
            </div>
         </div>
      </div>
   );
};

export default Search;
