import React, { FC } from 'react';
import { Field, FormikProps } from 'formik';
import AuthInputBox from '../../common/inputBox/authInputBox';
import { ProfileRegisterFormValues } from '..';
const s = require('../profileRegisterForm.scss');

type EmailPasswordFieldsProps = {
  formikProps: FormikProps<ProfileRegisterFormValues>;
  needPwd: boolean;
  email?: string;
};

const EmailPasswordFields: FC<EmailPasswordFieldsProps> = props => {
  const { formikProps, needPwd, email } = props;
  const { values, setFieldValue } = formikProps;

  if (values.email !== email) {
    setFieldValue('email', email);
  }

  return (
    <>
      <div className={s.formRow}>
        <div className={s.formWrapper}>
          <label className={s.formLabel}>Email</label>
          <Field
            name="email"
            type="email"
            component={AuthInputBox}
            wrapperStyles={{ padding: '0 0 0 10px' }}
            style={{ padding: '0 12px' }}
            className={s.inputForm}
            iconName="EMAIL"
            disabled
          />
        </div>
      </div>
      {!needPwd && (
        <div className={s.formRow}>
          <div className={s.formWrapper}>
            <label className={s.formLabel}>Password</label>
            <Field
              name="password"
              type="password"
              component={AuthInputBox}
              className={s.inputForm}
              iconName="PASSWORD"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EmailPasswordFields;
