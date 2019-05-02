import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect, Dispatch } from "react-redux";
import { OAuthCheckParams } from "../../../api/types/auth";
import { withStyles } from "../../../helpers/withStylesHelper";
import AuthAPI from "../../../api/auth";
import Icon from "../../../icons";
import { signInWithSocial } from "../signIn/actions";
import { closeDialog } from "../../dialog/actions";
import { AppState } from "../../../reducers";
import { DialogState } from "../../dialog/reducer";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const s = require("./authButton.scss");

declare var gapi: any;

interface AuthButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  isLoading: boolean;
  text: string;
  dispatch: Dispatch<any>;
  dialogState: DialogState;
  iconName?: string;
  iconClassName?: string;
  onSignUpWithSocial: (values: OAuthCheckParams) => void;
}

const AuthButton: React.FunctionComponent<AuthButtonProps> = props => {
  const { dispatch, isLoading, text, iconName, iconClassName, onSignUpWithSocial, dialogState, ...btnProps } = props;
  const [gapiIsLoading, setGapiIsLoading] = React.useState(typeof gapi === "undefined");
  const buttonEl = React.useRef<HTMLButtonElement | null>(null);
  let auth2: any;

  React.useEffect(
    () => {
      if (typeof gapi !== "undefined") {
        setGapiIsLoading(false);
      }
    },
    [typeof gapi]
  );

  React.useEffect(
    () => {
      if (buttonEl.current && typeof gapi !== "undefined") {
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
                await dispatch(signInWithSocial("GOOGLE", idToken));
                const authContext = dialogState.authContext;
                if (authContext) {
                  let actionLabel: string | null = authContext.expName || authContext.actionLabel;

                  if (!actionLabel) {
                    actionLabel = "topBar";
                  }

                  ActionTicketManager.trackTicket({
                    pageType: authContext.pageType,
                    actionType: "fire",
                    actionArea: authContext.actionArea,
                    actionTag: "signIn",
                    actionLabel,
                    expName: authContext.expName,
                  });
                }
                dispatch(closeDialog());
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
    [buttonEl.current, typeof gapi]
  );

  const iconNode = iconName ? <Icon icon={iconName} className={iconClassName} /> : null;
  const spinnerStyle: React.CSSProperties = iconName ? { right: "20px" } : { left: "20px" };
  const spinner =
    isLoading || gapiIsLoading ? (
      <CircularProgress size={16} thickness={4} color="inherit" style={spinnerStyle} className={s.buttonSpinner} />
    ) : null;

  return (
    <button {...btnProps} ref={buttonEl} className={s.authBtn} disabled={btnProps.disabled || gapiIsLoading}>
      {iconNode}
      {spinner}
      {text}
    </button>
  );
};

function mapStateToProps(state: AppState) {
  return {
    dialogState: state.dialog,
  };
}

export default connect(mapStateToProps)(withStyles<typeof AuthButton>(s)(AuthButton));
