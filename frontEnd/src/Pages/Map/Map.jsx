import React from "react";
import TilePage from "../../Components/TilePage/TilePage";

const Map = () => {
  return (
    <>
      <div>
        <TilePage
          title={"Water Supplied Routes"}
          linkName1={"Add Completed"}
          linkName2={"Completed Routes"}
          link1={"/add-completed-routes"}
          link2={"/completed-routes"}
        />
      </div>
    </>
  );
};

export default Map;
