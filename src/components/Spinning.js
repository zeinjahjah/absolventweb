const Spinning = ({ size }) => {
   if (size === "full") return <div className="loading">Loading</div>;
   else if (size === "small")
      return (
         <div className="load-wrapp">
            <div className="load-3">
               <div className="line"></div>
               <div className="line"></div>
               <div className="line"></div>
            </div>
         </div>
      );
};

export default Spinning;
