import * as React from "react";
import * as ReactGA from "react-ga";
import { Formik, Form, Field, FormikErrors } from "formik";
import AuthAPI from "../../../../../api/auth";
import { withStyles } from "../../../../../helpers/withStylesHelper";
import AuthInputBox from "../../../../common/inputBox/authInputBox";
import { OAUTH_VENDOR, GetAuthorizeUriResult } from "../../../../../api/types/auth";
import AuthButton from "../../../authButton";
import ORSeparator from "../../../separator";
import AuthTabs from "../../../authTabs";
import validateEmail from "../../../../../helpers/validateEmail";
import { GLOBAL_DIALOG_TYPE } from "../../../../dialog/reducer";
import EnvChecker from "../../../../../helpers/envChecker";
import alertToast from "../../../../../helpers/makePlutoToastAction";
import PlutoAxios from "../../../../../api/pluto";
import { debouncedCheckDuplicate } from "../../helpers/checkDuplicateEmail";
const store = require("store");
const s = require("./firstForm.scss");

interface FirstFormProps {
  onSubmit: (values: FormValues) => void;
  onClickTab: (type: GLOBAL_DIALOG_TYPE) => void;
}
interface FormValues {
  email: string;
  password: string;
}

export function handleClickOAuthBtn(vendor: OAUTH_VENDOR) {
  return async () => {
    store.set("oauthRedirectPath", location.pathname + location.search);

    const origin = EnvChecker.getOrigin();
    const redirectURI = `${origin}/users/sign_up?vendor=${vendor}`;
    try {
      const authroizedData: GetAuthorizeUriResult = await AuthAPI.getAuthorizeURI({
        vendor,
        redirectURI,
      });

      if (!EnvChecker.isOnServer()) {
        ReactGA.set({ referrer: origin });
        window.location.replace(authroizedData.uri);
      }
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
    }
  };
}

export const oAuthBtnBaseStyle: React.CSSProperties = { position: "relative", fontSize: "13px", marginTop: "10px" };

const FirstForm: React.FunctionComponent<FirstFormProps> = props => {
  const [isLoading, setIsLoading] = React.useState(false);

  const validateForm = async (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    const { email, password } = values;

    if (!validateEmail(values.email)) {
      errors.email = "Please enter a valid email address";
    }

    setIsLoading(true);
    const errorMsg = await debouncedCheckDuplicate(email);
    setIsLoading(false);

    if (errorMsg) {
      errors.email = errorMsg;
    }

    if (password.length < 8) {
      errors.password = "Must have at least 8 characters!";
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  };

  return (
    <>
      <AuthTabs onClickTab={props.onClickTab} activeTab={"sign up"} />
      <div className={s.formWrapper}>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={props.onSubmit}
          validate={validateForm}
          render={() => {
            return (
              <Form>
                <Field name="email" type="email" component={AuthInputBox} placeholder="E-mail" iconName="EMAIL_ICON" />
                <Field
                  name="password"
                  type="password"
                  component={AuthInputBox}
                  placeholder="Password"
                  iconName="PASSWORD_ICON"
                />
                <AuthButton
                  type="submit"
                  isLoading={isLoading}
                  text="SIGN UP"
                  style={{ backgroundColor: "#6096ff", marginTop: "10px", fontSize: "14px" }}
                />
              </Form>
            );
          }}
        />
        <ORSeparator />
        <AuthButton
          isLoading={isLoading}
          text="SIGN UP WITH FACEBOOK"
          style={{ ...oAuthBtnBaseStyle, backgroundColor: "#3859ab", marginTop: "18px" }}
          iconName="FACEBOOK_LOGO"
          iconClassName={s.fbIconWrapper}
          onClick={handleClickOAuthBtn("FACEBOOK")}
        />
        <AuthButton
          isLoading={isLoading}
          text="SIGN UP WITH GOOGLE"
          style={{ ...oAuthBtnBaseStyle, backgroundColor: "#dc5240" }}
          iconName="GOOGLE_LOGO"
          iconClassName={s.googleIconWrapper}
          onClick={handleClickOAuthBtn("GOOGLE")}
        />
        <AuthButton
          isLoading={isLoading}
          text="SIGN UP WITH ORCID"
          style={{ ...oAuthBtnBaseStyle, backgroundColor: "#a5d027", marginBottom: "34px" }}
          iconName="ORCID_LOGO"
          iconClassName={s.orcidIconWrapper}
          onClick={handleClickOAuthBtn("ORCID")}
        />
      </div>
    </>
  );
};

export default withStyles<typeof FirstForm>(s)(FirstForm);
