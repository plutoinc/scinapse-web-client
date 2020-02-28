import * as React from 'react';
import { Formik, Field, FormikErrors, Form } from 'formik';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Button } from '@pluto_network/pluto-design-elements';
import DashedDividerWithContent from '../../../../common/separator';
import { withStyles } from '../../../../../helpers/withStylesHelper';
import { GLOBAL_DIALOG_TYPE } from '../../../../dialog/reducer';
import AuthTabs from '../../../authTabs';
import AuthInputBox from '../../../../common/inputBox/authInputBox';
import AffiliationBox from '../../../../authorCV/affiliationBox';
import validateEmail from '../../../../../helpers/validateEmail';
import { debouncedCheckDuplicate } from '../../helpers/checkDuplicateEmail';
import { MINIMUM_PASSWORD_LENGTH } from '../../../../../constants/auth';
const s = require('./style.scss');

interface SignUpFormProps {
  onClickNext: () => void;
  onClickTab: (type: GLOBAL_DIALOG_TYPE) => void;
  onSucceed: () => void;
  onClickBack: () => void;
  onSubmit: (values: SignUpFormValues) => Promise<void>;
  withSocial: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dispatch: Dispatch<any>;
}

export interface SignUpFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: string;
  profileLink: string;
  affiliationId: string | null;
}

const validateForm = async (values: SignUpFormValues, withSocial: boolean) => {
  const errors: FormikErrors<SignUpFormValues> = {};
  if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if ((!withSocial && !values.password) || (values.password && values.password.length < MINIMUM_PASSWORD_LENGTH)) {
    errors.password = 'Must have at least 8 characters!';
  }
  if (!values.firstName) {
    errors.firstName = 'Please enter your first name';
  }
  if (!values.lastName) {
    errors.lastName = 'Please enter your last name';
  }
  if (!values.affiliation) {
    errors.affiliation = 'Please enter your affiliation';
  }

  if (values.profileLink && values.profileLink.match(/(http(s)?:\/\/.)/g) === null) {
    errors.profileLink = 'Please write start to http:// or https://';
  }

  const emailErr = await debouncedCheckDuplicate(values.email);
  if (emailErr) {
    errors.email = emailErr;
  }

  if (Object.keys(errors).length) {
    throw errors;
  }
};

const SignUpForm: React.FunctionComponent<SignUpFormProps> = props => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      await props.onSubmit(values);
      props.onSucceed();
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthTabs onClickTab={props.onClickTab} activeTab={'sign up'} />
      <div className={s.signUpContainer}>
        <Formik
          initialValues={{
            email: props.email,
            password: props.password,
            firstName: props.firstName,
            lastName: props.lastName,
            affiliation: '',
            affiliationId: null,
            profileLink: '',
          }}
          onSubmit={handleSubmit}
          validate={value => validateForm(value, props.withSocial)}
          render={() => (
            <Form>
              <div className={s.additionalInformation}>ADDITIONAL INFORMATION</div>
              <div className={s.subHeader}>No abbreviation preferred</div>
              <div className={s.formContainer}>
                <Field name="email" type="email" component={AuthInputBox} placeholder="E-mail" iconName="EMAIL" />
                {!props.withSocial && (
                  <Field
                    name="password"
                    type="password"
                    component={AuthInputBox}
                    placeholder="Password"
                    iconName="PASSWORD"
                  />
                )}
                <div className={s.nameItemWrapper}>
                  <div className={s.nameItemSection}>
                    <Field
                      name="firstName"
                      type="text"
                      component={AuthInputBox}
                      placeholder="First Name"
                      iconName="FULL_NAME_ICON"
                    />
                  </div>
                  <div className={s.nameItemSection}>
                    <Field
                      name="lastName"
                      type="text"
                      component={AuthInputBox}
                      placeholder="Last Name"
                      iconName="FULL_NAME_ICON"
                    />
                  </div>
                </div>
                <Field
                  name="affiliation"
                  placeholder="Affiliation / Company"
                  type="text"
                  component={AffiliationBox}
                  affiliationIdFieldName="affiliationId"
                  inputBoxStyle={{ display: 'flex' }}
                  listWrapperStyle={{ top: '56px' }}
                  inputStyle={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'flex-start',
                    alignItems: 'center',
                    height: '47px',
                    fontSize: '14px',
                    borderRadius: '3px',
                    padding: '0 10px',
                    backgroundColor: 'white',
                    border: 'solid 1px $gray400',
                    overflow: 'hidden',
                    marginTop: '10px',
                  }}
                />
                <DashedDividerWithContent wrapperClassName={s.dashSeparatorBox} content="optional" />
                <Field name="profileLink" type="url" component={AuthInputBox} placeholder="Profile Link (Optional)" />
              </div>
              <div className={s.authButtonWrapper}>
                <Button
                  type="submit"
                  elementType="button"
                  aria-label="Scinapse sign up button"
                  isLoading={isLoading}
                  disabled={isLoading}
                  fullWidth
                  size="large"
                  onClick={props.onClickNext}
                >
                  <span>Sign up</span>
                </Button>
              </div>
            </Form>
          )}
        />

        <div className={s.authButtonWrapper}>
          <Button
            type="submit"
            size="large"
            variant="outlined"
            color="gray"
            elementType="button"
            aria-label="Go back button"
            onClick={props.onClickBack}
            isLoading={isLoading}
            fullWidth
          >
            <span>Go back</span>
          </Button>
        </div>
        <div className={s.signUpPrivacyPolicy}>
          {'By signing up, you agree with our '}
          <a href="https://scinapse.io/terms-of-service" target="_blank" rel="noopener nofollow noreferrer">
            Terms
          </a>
          {' & '}
          <a href="https://scinapse.io/privacy-policy" target="_blank" rel="noopener nofollow noreferrer">
            Privacy policy
          </a>.
        </div>
      </div>
    </>
  );
};

export default connect()(withStyles<typeof SignUpForm>(s)(SignUpForm));
