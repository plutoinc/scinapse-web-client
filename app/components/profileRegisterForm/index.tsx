import React, { FC } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import { SuggestAffiliation } from '../../api/suggest';
import { Affiliation } from '../../model/affiliation';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import AffiliationSelectBox from '../dialog/components/modifyProfile/affiliationSelectBox';
import { withStyles } from '../../helpers/withStylesHelper';
import classNames from 'classnames';
import { Button } from '@pluto_network/pluto-design-elements';
import AuthInputBox from '../common/inputBox/authInputBox';
const s = require('./profileRegisterForm.scss');

type ProfileRegisterFormValues = {
  firstName: string;
  lastName: string;
  affiliation: Affiliation | SuggestAffiliation;
  profileLink: string;
};

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

const EmailPasswordFields: FC<{ formikProps: FormikProps<ProfileRegisterFormValues> }> = props => {
  const {} = props.formikProps;
  return (
    <>
      <div className={s.formRow}>
        <div className={s.formWrapper}>
          <label className={s.formLabel}>Email</label>
          <Field name="email" type="email" component={AuthInputBox} className={s.inputForm} iconName="EMAIL" />
        </div>
      </div>
      <div className={s.formRow}>
        <div className={s.formWrapper}>
          <label className={s.formLabel}>Password</label>
          <Field name="password" type="password" component={AuthInputBox} className={s.inputForm} iconName="PASSWORD" />
        </div>
      </div>
    </>
  );
};

const NameInputFields: FC = () => (
  <div className={s.formRow}>
    <div className={s.formWrapper}>
      <label className={s.formLabel}>First Name</label>
      <Field name="firstName" placeholder="First Name" className={s.inputForm} />
    </div>
    <div className={s.formWrapper}>
      <label className={s.formLabel}>Last Name</label>
      <Field name="lastName" placeholder="Last Name" className={s.inputForm} />
    </div>
  </div>
);

const AffiliationInputField: FC<{ formikProps: FormikProps<ProfileRegisterFormValues> }> = props => {
  const { errors, touched } = props.formikProps;
  return (
    <div className={s.formRow}>
      <div className={s.formWrapper}>
        <label className={s.formLabel}>Affiliation</label>
        <Field
          name="affiliation"
          component={AffiliationSelectBox}
          placeholder="Last Name"
          className={classNames({
            [s.inputForm]: true,
            [s.hasError]: !!errors.affiliation && !!touched.affiliation,
          })}
          errorWrapperClassName={s.affiliationErrorMsg}
          format={formatAffiliation}
        />
      </div>
    </div>
  );
};

const ProfileRegisterForm: FC = () => {
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);

  const initialValues: ProfileRegisterFormValues = {
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    affiliation: {
      id: null,
      name: currentUser.affiliationName || '',
      nameAbbrev: null,
    },
    profileLink: '',
  };
  const handleSubmit = () => {};

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {formikProps => {
          const { isLoggedIn } = currentUser;
          return (
            <Form>
              {isLoggedIn || <EmailPasswordFields formikProps={formikProps} />}
              <NameInputFields />
              <AffiliationInputField formikProps={formikProps} />
              <div className={s.formRow}>
                {isLoggedIn ? (
                  <Button elementType="button" color="blue">
                    <span>Create profile</span>
                  </Button>
                ) : (
                  <Button elementType="button" color="blue">
                    <span>Create account & profile</span>
                  </Button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default withStyles<typeof ProfileRegisterForm>(s)(ProfileRegisterForm);
