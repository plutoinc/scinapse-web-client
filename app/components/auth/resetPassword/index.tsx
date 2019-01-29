import * as React from "react";
import { parse } from "qs";
import { RouteComponentProps, withRouter } from "react-router-dom";
import AuthAPI from "../../../api/auth";
import { connect, Dispatch } from "react-redux";
import { AppState } from "../../../reducers";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import AuthInputBox from "../../common/inputBox/authInputBox";
import { withStyles } from "../../../helpers/withStylesHelper";
import alertToast from "../../../helpers/makePlutoToastAction";
const styles = require("./resetPassword.scss");

interface ResetPasswordPageProps
  extends Readonly<{
      dispatch: Dispatch<any>;
    }>,
    RouteComponentProps<{}> {}

interface ResetPasswordPageStates
  extends Readonly<{
      isLoading: boolean;
      isFocusOn: ResetPasswordInputTypes | null;
      hasError: boolean;
      errorMessage: string;
      passwordInput: string;
      confirmPasswordInput: string;
    }> {}

enum ResetPasswordInputTypes {
  PASSWORD,
  CONFIRM_PASSWORD,
}

function mapStateToProps(_state: AppState) {
  return {};
}

@withStyles<typeof ResetPasswordPage>(styles)
class ResetPasswordPage extends React.PureComponent<ResetPasswordPageProps, ResetPasswordPageStates> {
  public constructor(props: ResetPasswordPageProps) {
    super(props);

    this.state = {
      isLoading: false,
      isFocusOn: null,
      hasError: false,
      errorMessage: "",
      passwordInput: "",
      confirmPasswordInput: "",
    };
  }

  public componentDidMount() {
    const { location, history } = this.props;
    const queryParams = parse(location.search, { ignoreQueryPrefix: true });

    if (!queryParams.token) {
      alertToast({
        type: "error",
        message: "Invalid access. You need a proper reset password token from e-mail.",
      });
      history.push("/users/sign_in");
    }
  }

  public render() {
    const { isFocusOn, hasError } = this.state;

    return (
      <div className={styles.signInContainer}>
        <form onSubmit={this.handleSubmitForm} className={styles.formContainer}>
          <div className={styles.title}>RESET YOUR PASSWORD</div>
          <div className={styles.subtitle}>
            {`Almost done, just enter your new password below.
          Must be at least 8 characters!`}
          </div>

          <AuthInputBox
            isFocused={isFocusOn === ResetPasswordInputTypes.PASSWORD}
            onFocusFunc={() => {
              this.onFocusInput(ResetPasswordInputTypes.PASSWORD);
            }}
            onChangeFunc={this.handlePasswordChange}
            onBlurFunc={this.onBlurPasswordInput}
            placeHolder="New password"
            hasError={hasError}
            inputType="password"
            iconName="PASSWORD_ICON"
          />
          <AuthInputBox
            isFocused={isFocusOn === ResetPasswordInputTypes.CONFIRM_PASSWORD}
            onFocusFunc={() => {
              this.onFocusInput(ResetPasswordInputTypes.CONFIRM_PASSWORD);
            }}
            onChangeFunc={this.handleConfirmPasswordChange}
            onBlurFunc={this.onBlurConfirmPasswordInput}
            placeHolder="Confirm password"
            hasError={hasError}
            inputType="password"
            iconName="PASSWORD_ICON"
          />
          {this.getErrorContent()}
          {this.getSubmitButton()}
        </form>
      </div>
    );
  }

  private handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    const { location, history } = this.props;
    const { passwordInput, confirmPasswordInput, hasError } = this.state;
    e.preventDefault();

    const queryParams = parse(location.search, { ignoreQueryPrefix: true });
    if (!hasError && queryParams.token && passwordInput === confirmPasswordInput && passwordInput.length >= 8) {
      try {
        this.setState({
          isLoading: true,
        });
        await AuthAPI.resetPassword(passwordInput, queryParams.token);
        this.setState({
          isLoading: false,
        });
        history.push("/users/sign_in");
      } catch (err) {
        this.setState({
          hasError: true,
          errorMessage: `Network Error: ${err}`,
        });
      }
    } else {
      this.setState({
        hasError: true,
        errorMessage: "Something went wrong. Check the fields are proper.",
      });
    }
  };

  private getErrorContent = () => {
    const { hasError, errorMessage } = this.state;

    if (hasError && errorMessage) {
      return <div className={styles.errorContent}>{errorMessage}</div>;
    } else {
      return null;
    }
  };

  private handleConfirmPasswordChange = (password: string) => {
    this.setState({
      confirmPasswordInput: password,
      hasError: false,
      errorMessage: "",
    });
  };

  private handlePasswordChange = (password: string) => {
    this.setState({
      passwordInput: password,
      hasError: false,
      errorMessage: "",
    });
  };

  private onFocusInput = (type: ResetPasswordInputTypes) => {
    this.setState({
      isFocusOn: type,
    });
  };

  private onBlurPasswordInput = () => {
    const { passwordInput } = this.state;

    this.setState({
      isFocusOn: null,
    });

    if (passwordInput.length < 8) {
      this.setState({
        hasError: true,
        errorMessage: "Password should be at least 8 characters.",
      });
    }
  };

  private onBlurConfirmPasswordInput = () => {
    const { passwordInput, confirmPasswordInput } = this.state;

    this.setState({
      isFocusOn: null,
    });

    if (passwordInput !== confirmPasswordInput) {
      this.setState({
        hasError: true,
        errorMessage: "The passwords must match!",
      });
    }
  };

  private getSubmitButton = () => {
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <div className={styles.loadingSubmitButton}>
          <ButtonSpinner className={styles.buttonSpinner} />
          RESET PASSWORD & SIGN IN
        </div>
      );
    } else {
      return (
        <button type="submit" className={styles.submitButton}>
          RESET PASSWORD & SIGN IN
        </button>
      );
    }
  };
}

export default connect(mapStateToProps)(withRouter(ResetPasswordPage));
