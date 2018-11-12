import * as React from "react";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import { WrappedFieldProps } from "redux-form";
const styles = require("./scinapseInput.scss");

interface InputBoxProps extends WrappedFieldProps {
  placeholder: string;
  autoFocus?: boolean;
  icon?: string;
  wrapperStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

class ScinapseReduxInput extends React.PureComponent<InputBoxProps> {
  public render() {
    const { wrapperStyle, inputStyle, placeholder, input, autoFocus = false } = this.props;
    const { onChange, value } = input;

    return (
      <div style={wrapperStyle} className={styles.inputBox}>
        <input style={inputStyle} placeholder={placeholder} onChange={onChange} autoFocus={autoFocus} value={value} />
        {this.getIcon()}
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
