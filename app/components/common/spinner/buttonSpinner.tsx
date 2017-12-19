import * as React from "react";
import CircularProgress from "material-ui/CircularProgress";

interface IButtonSpinnerParams {
  className?: string;
  size?: number;
  thickness?: number;
}

const ButtonSpinner = (params: IButtonSpinnerParams) => {
  const size = params.size | 13.5;
  const thickness = params.thickness | 2;

  return (
    <div className={params.className ? params.className : null}>
      <CircularProgress
        innerStyle={{ display: "flex" }}
        style={{ display: "flex" }}
        size={size}
        thickness={thickness}
        color="#656d7c"
      />
    </div>
  );
};

export default ButtonSpinner;
