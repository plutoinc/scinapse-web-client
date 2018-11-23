import * as React from "react";
import * as classNames from "classnames";
import { WrappedFieldProps } from "redux-form";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./scinapseInput.scss");

interface InputBoxProps extends WrappedFieldProps, React.HTMLProps<HTMLInputElement> {
  placeholder: string;
  autoFocus?: boolean;
  icon?: string;
  wrapperStyle?: React.CSSProperties;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
}

class ScinapseReduxInput extends React.PureComponent<InputBoxProps> {
  public render() {
    const { wrapperStyle, inputClassName, inputStyle, placeholder, input, meta, autoFocus = false } = this.props;
    const { onChange, value } = input;
    const { touched, error } = meta;

    return (
      <div>
        <div style={wrapperStyle} className={styles.inputBox}>
          <input
            className={classNames({
              [`${inputClassName}`]: true,
              [`${styles.error}`]: touched && error,
            })}
            style={inputStyle}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            autoFocus={autoFocus}
            value={value}
          />
          {this.getIcon()}
        </div>
        {touched && error && <div className={styles.errorMessage}>{error}</div>}
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
