import * as React from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withRouter } from "react-router-dom";
import { parse } from "qs";
import * as Actions from "./actions";
import { AppState } from "../../../reducers";
import Icon from "../../../icons";
import { closeDialog } from "../../dialog/actions";
import { EmailVerificationContainerProps, EmailVerificationParams } from "./types";
import { trackDialogView } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
import alertToast from "../../../helpers/makePlutoToastAction";
const styles = require("./emailVerification.scss");

export function mapStateToProps(state: AppState) {
  return {
    emailVerificationState: state.emailVerification,
  };
}

@withStyles<typeof EmailVerification>(styles)
class EmailVerification extends React.PureComponent<EmailVerificationContainerProps, {}> {
  public componentDidMount() {
    const { history } = this.props;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams: EmailVerificationParams = this.getParsedSearchParamsObject(searchString);
    const searchToken = searchParams.token;
    const searchEmail = searchParams.email;

    if (!!searchToken && !!searchEmail) {
      this.verifyToken(searchToken);
    } else {
      alertToast({
        type: "error",
        message: "Email verifying token or email doesn't exist.",
      });
      history.push("/");
    }
  }

  public render() {
    const { emailVerificationState } = this.props;
    const { isLoading, hasError } = emailVerificationState;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams: EmailVerificationParams = this.getParsedSearchParamsObject(searchString);
    const searchEmail = searchParams.email;

    if (isLoading) {
      return (
        <div className={styles.emailVerificationContainer}>
          <div
            className={styles.innerContainer}
            style={{ color: "#6096ff", height: "470px", display: "flex", justifyContent: "center" }}
          >
            <CircularProgress size={50} thickness={4} color="inherit" />
          </div>
        </div>
      );
    } else if (hasError) {
      return (
        <div className={styles.emailVerificationContainer}>
          <div className={styles.innerContainer}>
            <div className={styles.title}>VERIFICATION FAILED</div>
            <div className={styles.content}>{`Mail verification failed.
            Please try verification again.`}</div>
            <Icon className={styles.emailVerificationFailIconWrapper} icon="EMAIL_VERIFICATION_FAIL" />
            <div onClick={this.resendVerificationEmail} className={styles.resendEmailButton}>
              RESEND MAIL
            </div>
            <div className={styles.toEmail}>
              to <span className={styles.email}>{searchEmail}</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.emailVerificationContainer}>
          <div className={styles.innerContainer}>
            <div className={styles.title}>VERIFICATION COMPLETED</div>
            <div className={styles.content}>{`Sign up is all done.
            Now, you can use full feature of service.`}</div>
            <Icon className={styles.emailVerificationCompleteIconWrapper} icon="EMAIL_VERIFICATION_COMPLETE" />
            <div onClick={this.confirm} className={styles.confirmButton}>
              OKAY
            </div>
          </div>
        </div>
      );
    }
  }

  private getCurrentSearchParamsString = () => {
    const { location } = this.props;
    return location.search;
  };

  private getParsedSearchParamsObject = (searchString: string): EmailVerificationParams => {
    return parse(searchString, { ignoreQueryPrefix: true });
  };

  private verifyToken = (token: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.verifyToken(token));
  };

  private resendVerificationEmail = async () => {
    const { dispatch, handleChangeDialogType, history } = this.props;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams: EmailVerificationParams = this.getParsedSearchParamsObject(searchString);

    const searchEmail = searchParams.email;
    if (searchEmail) {
      await dispatch(Actions.resendVerificationEmail(searchEmail, !!handleChangeDialogType));
      history.push("/");
    }
  };

  private confirm = () => {
    const { dispatch, handleChangeDialogType, history } = this.props;
    const isDialog = !!handleChangeDialogType;

    if (isDialog) {
      dispatch(closeDialog());
      trackDialogView("emailConfirmClose");
    } else {
      history.push("/");
    }
  };
}

export default withRouter(connect(mapStateToProps)(EmailVerification));
