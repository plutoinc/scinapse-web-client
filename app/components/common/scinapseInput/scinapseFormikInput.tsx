import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import { FieldProps } from 'formik';
import Icon from '../../../icons';
const styles = require('./scinapseInput.scss');

export interface FormikInputBoxProps extends React.HTMLProps<HTMLInputElement> {
  icon?: string;
  iconClassName?: string;
  wrapperStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

class ScinapseFormikInput extends React.PureComponent<FormikInputBoxProps & FieldProps> {
  public render() {
    const { wrapperStyle, inputStyle, field, form, className, ...inputProps } = this.props;
    const { touched, errors } = form;
    const error = errors[field.name];

    return (
      <div className={styles.inputWrapper}>
        <div style={wrapperStyle} className={styles.inputBox}>
          <input {...field} {...inputProps} style={inputStyle} className={className} />
          {this.getIcon()}
        </div>
        {touched && error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  }

  private getIcon() {
    const { icon, iconClassName } = this.props;

    if (icon) {
      return (
        <div className={`${styles.icon} ${iconClassName}`}>
          <Icon icon={icon} />
        </div>
      );
    }
    return null;
  }
}

export default withStyles<typeof ScinapseFormikInput>(styles)(ScinapseFormikInput);
