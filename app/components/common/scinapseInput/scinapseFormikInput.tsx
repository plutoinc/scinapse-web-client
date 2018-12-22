import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { FieldProps } from "formik";
const styles = require("./scinapseInput.scss");

export interface FormikInputBoxProps extends React.HTMLProps<HTMLInputElement> {
  icon?: string;
  wrapperStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  inputClassName?: string;
}

class ScinapseFormikInput extends React.PureComponent<FormikInputBoxProps & FieldProps> {
  public render() {
    const { wrapperStyle, inputStyle, icon, field, form, inputClassName, ...inputProps } = this.props;

    return (
      <div style={wrapperStyle} className={styles.inputBox}>
        <input {...field} {...inputProps} style={inputStyle} className={inputClassName} />
      </div>
    );
  }
}

export default withStyles<typeof ScinapseFormikInput>(styles)(ScinapseFormikInput);
