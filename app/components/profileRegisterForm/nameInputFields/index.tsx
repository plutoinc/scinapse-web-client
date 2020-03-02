import React, { FC } from 'react';
import classNames from 'classnames';
import { Field, FormikProps } from 'formik';
import { ProfileRegisterFormValues } from '..';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('../profileRegisterForm.scss');

type NameInputFieldsProps = {
  formikProps: FormikProps<ProfileRegisterFormValues>;
};

const NameInputFields: FC<NameInputFieldsProps> = props => {
  useStyles(s);

  const { formikProps } = props;
  const { touched, errors } = formikProps;
  return (
    <div className={s.formRow}>
      <div className={s.formWrapper}>
        <label className={s.formLabel}>First Name</label>
        <Field
          name="firstName"
          placeholder="First Name"
          className={classNames({
            [s.inputForm]: true,
            [s.hasError]: !!touched.firstName && !!errors.firstName,
          })}
        />
        <span className={s.errorMsg}>{touched.firstName && errors.firstName}</span>
      </div>
      <div className={s.formWrapper}>
        <label className={s.formLabel}>Last Name</label>
        <Field
          name="lastName"
          placeholder="Last Name"
          className={classNames({
            [s.inputForm]: true,
            [s.hasError]: !!touched.lastName && !!errors.lastName,
          })}
        />
        <span className={s.errorMsg}>{touched.lastName && errors.lastName}</span>
      </div>
    </div>
  );
};

export default NameInputFields;
