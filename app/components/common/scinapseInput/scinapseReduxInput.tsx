import * as React from "react";
import * as classNames from "classnames";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./scinapseInput.scss");

interface InputBoxProps extends React.HTMLProps<HTMLInputElement> {
  placeholder: string;
  autoFocus?: boolean;
  icon?: string;
  wrapperStyle?: React.CSSProperties;
  className?: string;
  inputStyle?: React.CSSProperties;
}

class ScinapseReduxInput extends React.PureComponent<InputBoxProps> {
  public render() {
    const { wrapperStyle, className, inputStyle, placeholder, autoFocus = false } = this.props;

    return (
      <div>
        <div style={wrapperStyle} className={styles.inputBox}>
          <input
            className={classNames({
              [`${className}`]: true,
            })}
            style={inputStyle}
            name={name}
            placeholder={placeholder}
            autoFocus={autoFocus}
            value=""
          />
          {this.getIcon()}
        </div>
      </div>
    );
  }

  private getIcon() {
    const { icon } = this.props;

    if (icon) {
      return (
        <div className={styles.icon}>
          <Icon icon={icon} />
        </div>
      );
    }
    return null;
  }
}

export default withStyles<typeof ScinapseReduxInput>(styles)(ScinapseReduxInput);
