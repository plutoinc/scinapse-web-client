import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { FieldProps } from "formik";
import Checkbox from "@material-ui/core/Checkbox";
const styles = require("./scinapseCheckbox.scss");

export interface FormikCheckboxProps extends React.HTMLProps<HTMLInputElement> {
  wrapperStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  inputClassName?: string;
}

class ScinapseFormikCheckbox extends React.PureComponent<FormikCheckboxProps & FieldProps> {
  public componentDidMount() {
    const { form } = this.props;

    form.setFieldValue("isEmailHidden", false);
  }

  public render() {
    const { wrapperStyle, field, form, checked } = this.props;

    return (
      <div style={wrapperStyle} className={styles.inputBox}>
        <Checkbox
          {...field}
          classes={{
            root: styles.checkboxIcon,
            checked: styles.checkedCheckboxIcon,
          }}
          defaultChecked={checked}
          onChange={e => {
            form.setFieldValue("isEmailHidden", e.target.checked);
          }}
          color="primary"
        />
      </div>
    );
  }
}

export default withStyles<typeof ScinapseFormikCheckbox>(styles)(ScinapseFormikCheckbox);
