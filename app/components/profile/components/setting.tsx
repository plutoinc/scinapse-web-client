import * as React from "react";
import { InputBox } from "../../common/inputBox/inputBox";
import alertToast from "../../../helpers/makePlutoToastAction";

const styles = require("./setting.scss");

export interface ISettingProps {
  isValidUser: boolean;
  previousProfileImage: string;
  profileImageInput: string;
  previousInstitution: string;
  institutionInput: string;
  previousMajor: string;
  majorInput: string;
  handlePassInvalidUser: () => void;
  changeMajorInput: (major: string) => void;
  updateCurrentUserMajor: (major: string) => void;
  changeInstitutionInput: (institution: string) => void;
  changeProfileImageInput: (profileImage: string) => void;
  updateCurrentUserInstitution: (institution: string) => void;
  updateCurrentUserProfileImage: (profileImage: string) => void;
}

function getUpdateBtn(active: boolean, onClickFunc: () => void) {
  if (active) {
    return (
      <div onClick={onClickFunc} tabIndex={0} className={styles.updateBtn}>
        Update
      </div>
    );
  } else {
    return <div className={`${styles.updateBtn} ${styles.inActiveUpdateBtn}`}>Update</div>;
  }
}

type UPDATE_BTN_TYPE = "profileImage" | "institution" | "major";

function getUpdateBtnContainer(props: ISettingProps, type: UPDATE_BTN_TYPE) {
  let previousValue: string, inputValue: string;
  let onClickFunc: (value: string) => void;

  switch (type) {
    case "profileImage":
      previousValue = props.previousProfileImage;
      inputValue = props.profileImageInput;
      onClickFunc = props.updateCurrentUserProfileImage;
      break;
    case "institution":
      previousValue = props.previousInstitution;
      inputValue = props.institutionInput;
      onClickFunc = props.updateCurrentUserInstitution;
      break;
    case "major":
      previousValue = props.previousMajor;
      inputValue = props.majorInput;
      onClickFunc = props.updateCurrentUserMajor;
      break;
    default:
      break;
  }

  if (previousValue === null) previousValue = "";
  if (inputValue === null) inputValue = "";

  const isActiveBtn: boolean = previousValue !== inputValue;

  return (
    <div className={styles.updateBtnContainer}>
      <InputBox onChangeFunc={props.changeProfileImageInput} type="short" defaultValue={inputValue} />
      {getUpdateBtn(isActiveBtn, () => {
        onClickFunc(inputValue);
      })}
    </div>
  );
}

class Setting extends React.PureComponent<ISettingProps, {}> {
  public componentDidMount() {
    const { isValidUser, handlePassInvalidUser } = this.props;

    if (!isValidUser) {
      alertToast({
        type: "warning",
        message: "You are not valid user to access this page.",
      });
      handlePassInvalidUser();
    }
  }

  public render() {
    return (
      <div className={styles.settingContainer}>
        <div className={styles.title}>Public Profile Settings</div>
        <div className={styles.smallTitle}>Profile image URL</div>
        {getUpdateBtnContainer(this.props, "profileImage")}
        <div className={styles.title}>Additional Information Settings</div>
        <div className={styles.smallTitle}>Institution</div>
        {getUpdateBtnContainer(this.props, "institution")}
        <div className={styles.smallTitle}>Major</div>
        {getUpdateBtnContainer(this.props, "major")}
      </div>
    );
  }
}

export default Setting;
