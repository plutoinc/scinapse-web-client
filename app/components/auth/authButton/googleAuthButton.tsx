import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SignInResult, OAUTH_VENDOR } from "../../../api/types/auth";
import { withStyles } from "../../../helpers/withStylesHelper";
import AuthAPI from "../../../api/auth";
import Icon from "../../../icons";
const s = require("./authButton.scss");

declare var gapi: any;

interface AuthButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  isLoading: boolean;
  text: string;
  iconName?: string;
  iconClassName?: string;
  onSignInWithSocial?: (user: SignInResult) => void;
  onSignUpWithSocial: (
    values: { email?: string | null; firstName: string; lastName: string; token: string; vendor: OAUTH_VENDOR }
  ) => void;
}

const AuthButton: React.FunctionComponent<AuthButtonProps> = props => {
  const { isLoading, text, iconName, iconClassName, onSignInWithSocial, onSignUpWithSocial, ...btnProps } = props;
  const buttonEl = React.useRef<HTMLButtonElement | null>(null);
  let auth2: any;

  React.useEffect(
    () => {
      if (buttonEl.current) {
        gapi.load("auth2", () => {
          auth2 = gapi.auth2.init({
            client_id: "304104926631-429jkjmqj2lgme52067ecm5fk30iqpjr.apps.googleusercontent.com",
            cookiepolicy: "single_host_origin",
          });
          attachSignIn(buttonEl.current);
        });

        function attachSignIn(element: any) {
          auth2.attachClickHandler(
            element,
            {},
            async (res: any) => {
              const idToken = res.getAuthResponse().id_token;
              const status = await AuthAPI.checkOAuthStatus("GOOGLE", idToken);

              if (status.isConnected) {
                const user = await AuthAPI.loginWithOAuth("GOOGLE", idToken);
                onSignInWithSocial && onSignInWithSocial(user);
              } else {
                onSignUpWithSocial &&
                  onSignUpWithSocial({
                    email: status.email,
                    firstName: status.firstName,
                    lastName: status.lastName,
                    token: idToken,
                    vendor: "GOOGLE",
                  });
              }
            },
            (error: Error) => {
              alert(JSON.stringify(error, undefined, 2));
            }
          );
        }
      }
    },
    [buttonEl.current]
  );

  const iconNode = iconName ? <Icon icon={iconName} className={iconClassName} /> : null;
  const spinnerStyle: React.CSSProperties = iconName ? { right: "20px" } : { left: "20px" };
  const spinner = isLoading ? (
    <CircularProgress size={16} thickness={4} color="inherit" style={spinnerStyle} className={s.buttonSpinner} />
  ) : null;

  return (
    <button {...btnProps} ref={buttonEl} className={s.authBtn}>
      {iconNode}
      {spinner}
      {text}
    </button>
  );
};

export default withStyles<typeof AuthButton>(s)(AuthButton);
