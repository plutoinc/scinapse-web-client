import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const s = require("./authButton.scss");

interface AuthButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  isLoading: boolean;
  text: string;
  iconName?: string;
  iconClassName?: string;
}

const AuthButton: React.FunctionComponent<AuthButtonProps> = props => {
  const { isLoading, text, iconName, iconClassName, ...btnProps } = props;

  const iconNode = iconName ? <Icon icon={iconName} className={iconClassName} /> : null;
  const spinnerStyle: React.CSSProperties = iconName ? { right: "20px" } : { left: "20px" };
  const spinner = isLoading ? (
    <CircularProgress size={16} thickness={4} color="inherit" style={spinnerStyle} className={s.buttonSpinner} />
  ) : null;

  return (
    <button {...btnProps} className={s.authBtn}>
      {iconNode}
      {spinner}
      {text}
    </button>
  );
};

export default withStyles<typeof AuthButton>(s)(AuthButton);
