import * as React from 'react';
import { FieldProps } from 'formik';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./authInputBox.scss');

interface AuthInputBoxProps extends React.HTMLProps<HTMLInputElement> {
  iconName: string;
  wrapperStyles?: React.CSSProperties;
}

const AuthInputBox: React.FunctionComponent<AuthInputBoxProps & FieldProps> = props => {
  const { field, form, iconName, wrapperStyles, ...inputProps } = props;
  const { touched, errors } = form;
  const error = errors[field.name];
  const hasError = touched[field.name] && error;
  const formBoxClassName = hasError ? `${styles.formBox} ${styles.formError}` : styles.formBox;

  return (
    <>
      <div style={wrapperStyles} className={formBoxClassName}>
        <Icon className={`${styles.formBoxIconWrapper} ${styles[iconName]}`} icon={iconName} />
        <input {...field} {...inputProps} className={`form-control ${styles.inputBox}`} />
      </div>
      {hasError && <div className={styles.errorContent}>{error}</div>}
    </>
  );
};

export default withStyles<typeof AuthInputBox>(styles)(AuthInputBox);
