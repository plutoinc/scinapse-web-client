import * as React from "react";
import CircularProgress from "material-ui/CircularProgress";

interface ButtonSpinnerProps {
  className?: string;
  size?: number;
  thickness?: number;
}

const ButtonSpinner = ({
  size = 13.5,
  thickness = 2,
  className
}: ButtonSpinnerProps) => {
  return (
    <div className={className}>
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
