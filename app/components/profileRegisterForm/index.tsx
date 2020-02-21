import React, { FC, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, FormikErrors } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import { SuggestAffiliation } from '../../api/suggest';
import { Affiliation } from '../../model/affiliation';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import { ProfileRegisterParams } from '../profileRegister';
import AffiliationAPI, { TokenVerificationRes } from '../../api/affiliation';
import profileAPI from '../../api/profile';
import EmailPasswordFields from './emailPasswordFields';
import NameInputFields from './nameInputFields';
import AffiliationInputField from './affiliationField';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { getCurrentPageType } from '../locationListener';
import memberAPI from '../../api/member';
import { Profile } from '../../model/profile';
import { checkAuthStatus } from '../auth/actions';
import alertToast from '../../helpers/makePlutoToastAction';
import PlutoAxios from '../../api/pluto';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profileRegisterForm.scss');

type ProfileRegisterStatus =
  | 'NOT_SET' // NOT SET! NEED VERIFICATION
  | 'NOT_A_MEMBER' // NEED TO SIGNUP WITH CREATING PROFILE
  | 'WRONG_MEMBER' // CURRENT USER DOES NOT MATCH WITH THE MEMBER SENT VERIFICATION EMAIL
  | 'NEED_LOGIN' // IS A USER! NEED TO LOGIN
  | 'PROFILE'; // IS A USER! CONTINUE TO CREATE A PROFILE

type ProfileRegisterFormProps = {
  queryParams: ProfileRegisterParams;
};

export type ProfileRegisterFormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: Affiliation | SuggestAffiliation;
  profileLink: string;
};

const validateForm = (values: ProfileRegisterFormValues, type: ProfileRegisterStatus) => {
  const errors: FormikErrors<ProfileRegisterFormValues> = {};
  const { firstName, lastName, password } = values;

  if (!firstName) {
    errors.firstName = 'Required';
  }

  if (!lastName) {
    errors.lastName = 'Required';
  }

  if (type === 'NOT_A_MEMBER') {
    if (!password) {
      errors.password = 'Password required';
    }
    if (!!password && password.length < 8) {
      errors.password = 'Password must be more than 8 characters';
    }
  }
  return errors;
};

const createProfile = (token: string, values: ProfileRegisterFormValues) => {
  const { id: affiliation_id, name: affiliation_name } = values.affiliation as Affiliation;
  return profileAPI.createProfile(token, {
    affiliation_id,
    affiliation_name,
    bio: null,
    email: values.email,
    first_name: values.firstName,
    last_name: values.lastName,
    is_email_public: true,
    web_page: null,
  });
};

const createMemberAndProfile = (token: string, values: ProfileRegisterFormValues) => {
  const { id: affiliation_id, name: affiliation_name } = values.affiliation as Affiliation;
  return memberAPI.createMemberWithProfile(token, {
    affiliation_id,
    affiliation_name,
    bio: null,
    email: values.email,
    first_name: values.firstName,
    last_name: values.lastName,
    is_email_public: true,
    web_page: null,
    password: values.password,
  });
};

const SigninContent: FC = () => {
  const openSigninModal = () => {
    GlobalDialogManager.openSignInDialog({
      authContext: {
        pageType: getCurrentPageType(),
        actionArea: 'profileRegister',
        actionLabel: 'profileRegisterSignin',
      },
      isBlocked: false,
    });
  };

  return (
    <>
      <div className={s.formContainer}>
        <h2>Sign in to continue</h2>
        <Button elementType="button" variant="contained" color="blue" onClick={openSigninModal}>
          <span>Sign in</span>
        </Button>
      </div>
    </>
  );
};

const ProfileRegisterForm: FC<ProfileRegisterFormProps> = props => {
  useStyles(s);
  const { queryParams } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationState, setVerificationState] = useState<TokenVerificationRes | null>(null);

  const formStatus: ProfileRegisterStatus = useMemo(() => {
    if (!verificationState) return 'NOT_SET';
    if (verificationState.isMember && currentUser.isLoggedIn) {
      if (verificationState.memberId === currentUser.id) {
        return 'PROFILE';
      } else {
        return 'WRONG_MEMBER';
      }
    } else if (verificationState.isMember && !currentUser.isLoggedIn) {
      return 'NEED_LOGIN';
    }
    return 'NOT_A_MEMBER';
  }, [currentUser, verificationState]);

  const initialValues: ProfileRegisterFormValues = {
    email: '',
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

  useEffect(() => {
    AffiliationAPI.verifyByToken(queryParams.token).then(res => {
      setVerificationState(res);
    });
  }, [queryParams.token, currentUser]);

  const handleSubmit = async (values: ProfileRegisterFormValues) => {
    const { id: affiliation_id, name: affiliation_name } = values.affiliation as Affiliation;
    if (!affiliation_id || !affiliation_name) {
      return;
    }

    if (formStatus === 'WRONG_MEMBER') {
      return alertToast({
        type: 'error',
        message: 'Current user does not match with the member sent verification email.',
      });
    }

    setIsLoading(true);

    try {
      setIsLoading(true);

      let res: Profile | null = null;
      if (formStatus === 'PROFILE') {
        res = await createProfile(queryParams.token, values);
      } else if (formStatus === 'NOT_A_MEMBER' && queryParams.token) {
        res = (await createMemberAndProfile(queryParams.token, values)).profile;
      }

      setIsLoading(false);

      if (res && res.id) {
        await dispatch(checkAuthStatus());
        history.push(`/profiles/${res.id}`);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const error = PlutoAxios.getGlobalError(err);
      alertToast({ type: 'error', message: error.message });
    }
  };

  return (
    <>
      {formStatus === 'NEED_LOGIN' ? (
        <SigninContent />
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={values => validateForm(values, formStatus)}
        >
          {formikProps => {
            return (
              <Form className={s.formContainer}>
                <h2 className={s.formTitle}>Registration</h2>
                <div className={s.description}>
                  To create your account and profile page, fill in the following information below.
                </div>
                <AffiliationInputField
                  formikProps={formikProps}
                  profileAffiliation={verificationState && verificationState?.affiliation}
                />
                <EmailPasswordFields
                  formikProps={formikProps}
                  needPwd={formStatus !== 'NOT_A_MEMBER'}
                  email={verificationState?.email}
                />
                <NameInputFields formikProps={formikProps} />
                <div className={s.formRow}>
                  {formStatus === 'PROFILE' ? (
                    <Button
                      size="large"
                      elementType="button"
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
                      fullWidth
                    >
                      <span>Create profile</span>
                    </Button>
                  ) : (
                    <Button
                      size="large"
                      elementType="button"
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
                      fullWidth
                    >
                      <span>Create account & profile</span>
                    </Button>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default ProfileRegisterForm;
