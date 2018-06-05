import * as React from "react";
import { Dispatch, connect } from "react-redux";
import AuthAPI from "../../../api/auth";
import { withStyles } from "../../../helpers/withStylesHelper";
import AuthInputBox from "../../common/inputBox/authInputBox";
import { AppState } from "../../../reducers";
import validateEmail from "../../../helpers/validateEmail";
import Icon from "../../../icons";
import { changeDialogType } from "../../dialog/actions";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/reducer";
const styles = require("./resetPassword.scss");

interface ResetPasswordProps
  extends Readonly<{
      handleCloseDialogRequest: () => void;
      dispatch: Dispatch<any>;
    }> {}
interface ResetPasswordStates
  extends Readonly<{
      isFocused: boolean;
      isLoading: boolean;
      hasError: boolean;
      isFinished: boolean;
      errorMessage: string;
      email: string;
    }> {}

function mapStateToProps(_state: AppState) {
  return {};
}

@withStyles<typeof ResetPasswordContainer>(styles)
class ResetPasswordContainer extends React.PureComponent<ResetPasswordProps, ResetPasswordStates> {
  public constructor(props: ResetPasswordProps) {
    super(props);

    this.state = {
      isFocused: false,
      isLoading: false,
      hasError: false,
      isFinished: false,
      email: "",
      errorMessage: "",
    };
  }

  public render() {
    const { handleCloseDialogRequest } = this.props;

    return (
      <div className={styles.resetPasswordContainer}>
        <div onClick={handleCloseDialogRequest} className={styles.closeButtonWrapper}>
          <Icon icon="X_BUTTON" className={styles.closeButtonIcon} />
        </div>
        <div className={styles.dialogTitle}>FORGOT YOUR PASSWORD?</div>
        <div className={styles.dialogSubtitle}>We'll email you instruction about how to reset it.</div>
        {this.getContent()}
      </div>
    );
  }

  private getContent = () => {
    const { isFinished, isFocused, hasError } = this.state;

    if (isFinished) {
      return (
        <div className={styles.successBox}>
          <div className={styles.verificationEmailIconWrapper}>
            <Icon icon="VERIFICATION_EMAIL_ICON" />
          </div>
          <div className={styles.successTitle}>Sent reset password Email!</div>
          <div className={styles.successSubtitle}>
            <div>We've just emailed you instructions on</div>
            <div>how to reset your password.</div>
          </div>
        </div>
      );
    } else {
      return (
        <form onSubmit={this.handleSubmitForm} className={styles.formContainer}>
          <AuthInputBox
            isFocused={isFocused}
            onFocusFunc={this.handleFocusInput}
            onChangeFunc={this.handleChangeInput}
            onBlurFunc={this.handleBlurInput}
            placeHolder="E-mail"
            hasError={hasError}
            inputType="email"
            iconName="EMAIL_ICON"
          />
          {this.getErrorMessage()}
          <button className={styles.submitButton}>RESET PASSWORD</button>
          <button onClick={this.handleClickGoBackButton} className={styles.backButton}>
            GO BACK
          </button>
        </form>
      );
    }
  };

  private handleClickGoBackButton = () => {
    const { dispatch } = this.props;

    dispatch(changeDialogType(GLOBAL_DIALOG_TYPE.SIGN_IN));
  };

  private getErrorMessage = () => {
    const { hasError, errorMessage } = this.state;

    if (hasError) {
      return <div className={styles.errorMessageBox}>{errorMessage}</div>;
    } else {
      return null;
    }
  };

  private handleChangeInput = (email: string) => {
    this.setState({ email, hasError: false, errorMessage: "" });
  };

  private handleFocusInput = () => {
    this.setState({
      isFocused: true,
    });
  };

  private handleBlurInput = () => {
    this.setState({
      isFocused: false,
    });
  };

  private handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    const { email } = this.state;
    e.preventDefault();

    if (!validateEmail(email)) {
      this.setState({
        hasError: true,
        errorMessage: "Please enter a valid email address.",
      });
      return;
    }

    try {
      this.setState({ isLoading: true });
      await AuthAPI.requestResetPasswordToken(email);
      this.setState({ isLoading: false, isFinished: true });
    } catch (_err) {
      this.setState({
        hasError: true,
        errorMessage: "Email not found. Please try again or contact our support.",
      });
    }
  };
}

export default connect(mapStateToProps)(ResetPasswordContainer);
