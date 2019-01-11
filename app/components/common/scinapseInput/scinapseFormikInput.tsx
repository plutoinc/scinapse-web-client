import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { FieldProps } from "formik";
const styles = require("./scinapseInput.scss");

export interface FormikInputBoxProps extends React.HTMLProps<HTMLInputElement> {
  icon?: string;
  wrapperStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

class ScinapseFormikInput extends React.PureComponent<FormikInputBoxProps & FieldProps> {
  public render() {
    const { wrapperStyle, inputStyle, icon, field, form, className, ...inputProps } = this.props;
    const { touched, errors } = form;
    const error = errors[field.name];

    return (
      <div className={styles.inputWrapper}>
        <div style={wrapperStyle} className={styles.inputBox}>
          <input {...field} {...inputProps} style={inputStyle} className={className} />
        </div>
        {touched && error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  }
}

export default withStyles<typeof ScinapseFormikInput>(styles)(ScinapseFormikInput);
