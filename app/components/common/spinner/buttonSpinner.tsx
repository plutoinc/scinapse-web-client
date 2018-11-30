import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

interface ButtonSpinnerProps {
  className?: string;
  size?: number;
  thickness?: number;
  color?: string;
}

// WARNING: DEPRECATEDPc
const ButtonSpinner = ({ size = 13.5, thickness = 2, className, color }: ButtonSpinnerProps) => {
  return (
    <div className={className}>
      <CircularProgress style={{ color }} size={size} thickness={thickness} color="inherit" />
    </div>
  );
};

export default ButtonSpinner;
