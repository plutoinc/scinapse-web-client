import * as React from "react";
import CircularProgress from "material-ui/CircularProgress";

const ButtonSpinner = () => {
  return (
    <div>
      <CircularProgress
        innerStyle={{ display: "flex" }}
        style={{ display: "flex" }}
        size={13.5}
        thickness={2}
        color="#656d7c"
      />
    </div>
  );
};

export default ButtonSpinner;
