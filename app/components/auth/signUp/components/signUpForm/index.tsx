import * as React from "react";
import { Formik, Field, FormikErrors, Form } from "formik";
import { connect, Dispatch } from "react-redux";
import { withStyles } from "../../../../../helpers/withStylesHelper";
import { GLOBAL_DIALOG_TYPE } from "../../../../dialog/reducer";
import AuthTabs from "../../../authTabs";
import AuthInputBox from "../../../../common/inputBox/authInputBox";
import AuthButton from "../../../authButton";
import validateEmail from "../../../../../helpers/validateEmail";
import { signUpWithEmail } from "../../actions";
import { debouncedCheckDuplicate } from "../../helpers/checkDuplicateEmail";
const s = require("./style.scss");

interface SignUpFormProps {
  onClickTab: (type: GLOBAL_DIALOG_TYPE) => void;
  onSucceed: () => void;
  onClickBack: () => void;
  email: string;
  password: string;
  dispatch: Dispatch<any>;
}

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: string;
}

const validateForm = async (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {};
  if (!validateEmail(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.password || (values.password && values.password.length < 8)) {
    errors.password = "Must have at least 8 characters!";
  }
  if (!values.firstName) {
    errors.firstName = "Please enter your first name";
  }
  if (!values.lastName) {
    errors.lastName = "Please enter your last name";
  }
  if (!values.affiliation) {
    errors.affiliation = "Please enter your affiliation";
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

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await props.dispatch(signUpWithEmail(values));
      props.onSucceed();
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthTabs onClickTab={props.onClickTab} activeTab={"sign up"} />
      <div className={s.signUpContainer}>
        <Formik
          initialValues={{ email: props.email, password: props.password, firstName: "", lastName: "", affiliation: "" }}
          onSubmit={handleSubmit}
          validate={validateForm}
          render={() => (
            <Form>
              <div className={s.additionalInformation}>ADDITIONAL INFORMATION</div>
              <div className={s.subHeader}>No abbreviation preferred</div>
              <Field name="email" type="email" component={AuthInputBox} placeholder="E-mail" iconName="EMAIL_ICON" />
              <Field
                name="password"
                type="password"
                component={AuthInputBox}
                placeholder="Password"
                iconName="PASSWORD_ICON"
              />
              <div>
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
                type="text"
                component={AuthInputBox}
                placeholder="Affiliation / Company"
                iconName="AFFILIATION_ICON"
              />
              <AuthButton
                type="submit"
                isLoading={isLoading}
                text="SIGN UP"
                style={{ backgroundColor: "#6096ff", marginTop: "10px", fontSize: "14px" }}
              />
            </Form>
          )}
        />
        <AuthButton
          isLoading={isLoading}
          type="button"
          onClick={props.onClickBack}
          style={{
            backgroundColor: "#e7eaef",
            fontSize: "14px",
            color: "#9aa3b5",
            marginTop: "10px",
            marginBottom: "30px",
          }}
          text="GO BACK"
        />
      </div>
    </>
  );
};

export default connect()(withStyles<typeof SignUpForm>(s)(SignUpForm));
