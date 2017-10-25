import * as React from "react";
import CircularProgress from "material-ui/CircularProgress";

interface IButtonSpinnerParams {
  className?: string;
}

const ButtonSpinner = (params: IButtonSpinnerParams) => {
  return (
    <div className={params.className ? params.className : null}>
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
