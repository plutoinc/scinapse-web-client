import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { FieldProps } from "formik";
const styles = require("./scinapseInput.scss");

export interface FormikSelectBoxProps extends React.HTMLProps<HTMLSelectElement> {
  icon?: string;
  inputStyle?: React.CSSProperties;
  placeHolderContent: string;
}

class ScinapseFormikSelect extends React.PureComponent<FormikSelectBoxProps & FieldProps> {
  public render() {
    const {
      inputStyle,
      icon,
      placeHolderContent,
      defaultValue,
      field,
      form,
      className,
      children,
      ...inputProps
    } = this.props;

    return (
      <select
        {...field}
        {...inputProps}
        style={inputStyle}
        className={className}
        value={defaultValue}
        onChange={e => {
          form.setFieldValue(field.name, e.target.value);
        }}
        required={true}
      >
        <option value="" hidden={true}>
          {placeHolderContent}
        </option>
        {children}
      </select>
    );
  }
}

export default withStyles<typeof ScinapseFormikSelect>(styles)(ScinapseFormikSelect);
