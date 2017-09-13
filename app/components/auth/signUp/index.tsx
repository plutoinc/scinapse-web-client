import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { ISignUpStateRecord } from "./records";

const styles = require("./signUp.scss");

interface ISignUpContainerProps {
  dispatch: Dispatch<any>;
  signUpState: ISignUpStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    signUpState: state.signUp
  };
}

class SignUp extends React.PureComponent<ISignUpContainerProps, {}> {
  private handleEmailChange = (email: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeEmailInput(email));
  };

  private checkValidEmailInput = (email: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.checkValidEmailInput(email));
  };

  private handlePasswordChange = (password: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changePasswordInput(password));
  };

  private checkValidPasswordInput = (password: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.checkValidPasswordInput(password));
  };

  private handleRepeatPasswordChange = (repeatPassword: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeRepeatPasswordInput(repeatPassword));
  };

  private checkValidRepeatPasswordInput = (repeatPassword: string) => {
    const { dispatch, signUpState } = this.props;
    dispatch(
      Actions.checkValidRepeatPasswordInput(
        signUpState.get("password"),
        repeatPassword
      )
    );
  };

  private handleFullNameChange = (fullName: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeFullNameInput(fullName));
  };

  private checkValidFullNameInput = (fullName: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.checkValidFullNameInput(fullName));
  };

  private createNewAccount = () => {
    const { signUpState, dispatch } = this.props;
    const { email, password, repeatPassword, fullName } = signUpState;
    dispatch(
      Actions.createNewAccount({
        email,
        password,
        repeatPassword,
        fullName
      })
    );
  };

  public render() {
    const { signUpState } = this.props;
    const { errorType, errorContent } = signUpState;

    // interface formBoxParams {
    //   inputType: string;
    //   iconName: string;
    //   onChangeFunc: Function;
    //   placeHolder: string;
    //   type: string;
    // }
    // const FormBox = (params: formBoxParams) => {
    //   const { inputType, iconName, onChangeFunc, placeHolder, type } = params;
    //   return (
    //     <div>
    //       <div
    //         className={
    //           errorType === inputType ? (
    //             `${styles.formBox} ${styles.formError}`
    //           ) : (
    //             styles.formBox
    //           )
    //         }
    //       >
    //         <Icon className={styles.iconWrapper} icon={iconName} />
    //         <div className={styles.separatorLine} />
    //         <input
    //           onChange={e => {
    //             onChangeFunc(e.currentTarget.value);
    //           }}
    //           onBlur={this.checkValidForm}
    //           placeholder={placeHolder}
    //           className={`form-control ${styles.inputBox}`}
    //           type={type}
    //         />
    //       </div>
    //       <div
    //         className={styles.errorContent}
    //         style={
    //           errorType === inputType ? (
    //             {
    //               display: "flex"
    //             }
    //           ) : null
    //         }
    //       >
    //         {errorType === inputType ? errorContent : null}
    //       </div>
    //     </div>
    //   );
    // };

    return (
      <div className={styles.signUpContainer}>
        <div className={styles.formContainer}>
          <div className={styles.authNavBar}>
            <Link className={styles.signInLink} to="sign_in">
              Sign in
            </Link>
            <Link className={styles.signUpLink} to="sign_up">
              Sign up
            </Link>
          </div>
          {/* <FormBox
            inputType="email"
            iconName="EMAIL_ICON"
            onChangeFunc={this.handleEmailChange}
            placeHolder="E-mail (Institution)"
            type="email"
          /> */}
          <div
            className={
              errorType === "email" ? (
                `${styles.formBox} ${styles.formError}`
              ) : (
                styles.formBox
              )
            }
          >
            <Icon className={styles.iconWrapper} icon="EMAIL_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handleEmailChange(e.currentTarget.value);
              }}
              onBlur={e => {
                this.checkValidEmailInput(e.currentTarget.value);
              }}
              placeholder="E-mail (Institution)"
              className={`form-control ${styles.inputBox}`}
              type="email"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "email" ? (
                {
                  display: "flex"
                }
              ) : null
            }
          >
            {errorType === "email" ? errorContent : null}
          </div>
          <div
            className={
              errorType === "password" ? (
                `${styles.formBox} ${styles.formError}`
              ) : (
                styles.formBox
              )
            }
          >
            <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handlePasswordChange(e.currentTarget.value);
              }}
              onBlur={e => {
                this.checkValidPasswordInput(e.currentTarget.value);
              }}
              placeholder="Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "password" ? (
                {
                  display: "flex"
                }
              ) : null
            }
          >
            {errorType === "password" ? errorContent : null}
          </div>
          <div
            className={
              errorType === "repeatPassword" ? (
                `${styles.formBox} ${styles.formError}`
              ) : (
                styles.formBox
              )
            }
          >
            <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handleRepeatPasswordChange(e.currentTarget.value);
              }}
              onBlur={e => {
                this.checkValidRepeatPasswordInput(e.currentTarget.value);
              }}
              placeholder="Repeat Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "repeatPassword" ? (
                {
                  display: "flex"
                }
              ) : null
            }
          >
            {errorType === "repeatPassword" ? errorContent : null}
          </div>
          <div
            className={
              errorType === "fullName" ? (
                `${styles.formBox} ${styles.formError}`
              ) : (
                styles.formBox
              )
            }
          >
            <Icon className={styles.iconWrapper} icon="FULL_NAME_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handleFullNameChange(e.currentTarget.value);
              }}
              onBlur={e => {
                this.checkValidFullNameInput(e.currentTarget.value);
              }}
              placeholder="Full Name"
              className={`form-control ${styles.inputBox}`}
              type="text"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "fullName" ? (
                {
                  display: "flex"
                }
              ) : null
            }
          >
            {errorType === "fullName" ? errorContent : null}
          </div>
          <div
            onClick={() => {
              this.createNewAccount();
            }}
            className={styles.submitBtn}
          >
            Create New Account
          </div>
          <div className={styles.signInBox}>
            <div className={styles.signInContent}>Already have an account?</div>
            <Link className={styles.signInBtn} to="sign_in">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUp);
