import * as React from "react";
import { InputBox } from "../../../common/inputBox/inputBox";

const styles = require("./setting.scss");

export interface ISettingProps {
  previousProfileImage: string;
  profileImageInput: string;
  changeProfileImageInput: (profileImage: string) => void;
  updateCurrentUserProfileImage: (profileImage: string) => void;
  previousInstitution: string;
  institutionInput: string;
  changeInstitutionInput: (institution: string) => void;
  updateCurrentUserInstitution: (institution: string) => void;
  previousMajor: string;
  majorInput: string;
  changeMajorInput: (major: string) => void;
  updateCurrentUserMajor: (major: string) => void;
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

const Setting = (props: ISettingProps) => {
  return (
    <div>
      <div className={styles.title}>Public Profile Settings</div>
      <div className={styles.smallTitle}>Profile image URL</div>
      {getUpdateBtnContainer(props, "profileImage")}
      <div className={styles.title}>Additional Information Settings</div>
      <div className={styles.smallTitle}>Institution</div>
      {getUpdateBtnContainer(props, "institution")}
      <div className={styles.smallTitle}>Major</div>
      {getUpdateBtnContainer(props, "major")}
    </div>
  );
};

export default Setting;
