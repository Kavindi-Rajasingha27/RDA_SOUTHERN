import React from "react";
import TilePage from "../../Components/TilePage/TilePage";

const Estimate = () => {
  return (
    <>
      <div>
        <TilePage
          title={"Water Supplied Routes"}
          linkName1={"Estimate"}
          linkName2={"Estimated Routes"}
          link1={"/estimator"}
          link2={"/estimated-routes"}
        />
      </div>
    </>
  );
};

export default Estimate;
