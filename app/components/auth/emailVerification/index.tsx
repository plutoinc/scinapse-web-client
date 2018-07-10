import * as React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as Actions from "./actions";
import { AppState } from "../../../reducers";
import { parse } from "qs";
import Icon from "../../../icons";
import { closeDialog } from "../../dialog/actions";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import {
  EmailVerificationContainerProps,
  EmailVerificationParams
} from "./types";
import { trackModalView } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
import alertToast from "../../../helpers/makePlutoToastAction";
import { withRouter } from "react-router-dom";
const styles = require("./emailVerification.scss");

export function mapStateToProps(state: AppState) {
  return {
    emailVerificationState: state.emailVerification
  };
}

@withStyles<typeof EmailVerification>(styles)
class EmailVerification extends React.PureComponent<
EmailVerificationContainerProps,
{}
> {
  public componentDidMount() {
    const { dispatch } = this.props;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams: EmailVerificationParams = this.getParsedSearchParamsObject(
      searchString
    );
    const searchToken = searchParams.token;
    const searchEmail = searchParams.email;

    if (!!searchToken && !!searchEmail) {
      this.verifyToken(searchToken);
    } else {
      alertToast({
        type: "error",
        message: "Email verifying token or email doesn't exist."
      });
      dispatch(push("/"));
    }
  }

  public render() {
    const { emailVerificationState } = this.props;
    const { isLoading, hasError } = emailVerificationState;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams: EmailVerificationParams = this.getParsedSearchParamsObject(
      searchString
    );
    const searchEmail = searchParams.email;

    if (isLoading) {
      return (
        <div className={styles.emailVerificationContainer}>
          <div className={styles.isLoadingContainer}>
            <ButtonSpinner size={50} thickness={4} />
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
            <Icon
              className={styles.emailVerificationFailIconWrapper}
              icon="EMAIL_VERIFICATION_FAIL"
            />
            <div
              onClick={this.resendVerificationEmail}
              className={styles.resendEmailButton}
            >
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
            <Icon
              className={styles.emailVerificationCompleteIconWrapper}
              icon="EMAIL_VERIFICATION_COMPLETE"
            />
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

  private getParsedSearchParamsObject = (
    searchString: string
  ): EmailVerificationParams => {
    return parse(searchString, { ignoreQueryPrefix: true });
  };

  private verifyToken = (token: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.verifyToken(token));
  };

  private resendVerificationEmail = () => {
    const { dispatch, handleChangeDialogType } = this.props;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams: EmailVerificationParams = this.getParsedSearchParamsObject(
      searchString
    );

    const searchEmail = searchParams.email;
    if (searchEmail) {
      dispatch(
        Actions.resendVerificationEmail(searchEmail, !!handleChangeDialogType)
      );
    }
  };

  private confirm = () => {
    const { dispatch, handleChangeDialogType } = this.props;
    const isDialog = !!handleChangeDialogType;

    if (isDialog) {
      dispatch(closeDialog());
      trackModalView("emailConfirmClose");
    } else {
      dispatch(push("/"));
    }
  };
}

export default withRouter(connect(mapStateToProps)(EmailVerification));
