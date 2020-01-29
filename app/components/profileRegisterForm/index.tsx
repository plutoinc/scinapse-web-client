import React, { FC, useState, useEffect } from 'react';
import { Formik, Form, Field, FormikProps, FormikConfig } from 'formik';
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
import { ProfileRegisterParams } from '../profileRegister';
import { ProfileAffiliation } from '../../model/profileAffiliation';
import affiliationAPI from '../../api/affiliation';
import profileAPI from '../../api/profile';
const s = require('./profileRegisterForm.scss');

type ProfileRegisterFormProps = {
  queryParams: ProfileRegisterParams;
}

type ProfileRegisterFormValues = {
  email: string;
  password: string;
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

const AffiliationInputField: FC<{ formikProps: FormikProps<ProfileRegisterFormValues>, profileAffiliation: ProfileAffiliation | null }> = props => {
  const { formikProps, profileAffiliation } = props;
  const { values, errors, touched, setFieldValue } = formikProps;

  if (profileAffiliation && (values.affiliation as Affiliation).id !== profileAffiliation.id) {
    const { id, name, nameAbbrev } = profileAffiliation;
    setFieldValue('affiliation', {
      id,
      name,
      nameAbbrev
    })
  }

  return (
    <div className={s.formRow}>
      <div className={s.formWrapper}>
        <label className={s.formLabel}>Affiliation</label>
        <Field
          name="affiliation"
          component={AffiliationSelectBox}
          placeholder="Affiliation"
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

const ProfileRegisterForm: FC<ProfileRegisterFormProps> = (props) => {
  const { queryParams } = props;
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);
  const [profileAffiliation, setProfileAffiliation] = useState<ProfileAffiliation | null>(null);

  const initialValues: ProfileRegisterFormValues = {
    email: currentUser.email || '',
    password: '',
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    affiliation: {
      id: null,
      name: currentUser.affiliationName || '',
      nameAbbrev: null,
    },
    profileLink: '',
  };

  const handleSubmit = (values: ProfileRegisterFormValues) => {
    const { id: affiliation_id, name: affiliation_name } = values.affiliation as Affiliation
    profileAPI.createProfile({
      affiliation_id: affiliation_id || '',
      affiliation_name,
      bio: ' ',
      email: currentUser.email,
      first_name: values.firstName,
      last_name: values.lastName,
      is_email_public: true,
      web_page: ' '
    });
  };

  useEffect(() => {
    async function fetchAffiliation() {
      if (queryParams.aid) {
        const affiliation = await affiliationAPI.getAffiliation(queryParams.aid);
        if (affiliation) {
          setProfileAffiliation(affiliation);
        }
      }
    }
    fetchAffiliation();
  }, [queryParams.aid])

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {formikProps => {
          const { isLoggedIn } = currentUser;
          return (
            <Form>
              {isLoggedIn || <EmailPasswordFields formikProps={formikProps} />}
              <NameInputFields />
              <AffiliationInputField
                formikProps={formikProps}
                profileAffiliation={profileAffiliation}
              />
              <div className={s.formRow}>
                {isLoggedIn ? (
                  <Button elementType="button" type="submit" color="blue">
                    <span>Create profile</span>
                  </Button>
                ) : (
                  <Button elementType="button" type="submit" color="blue">
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