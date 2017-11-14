import * as React from "react";
import { InputBox } from "../../common/inputBox/inputBox";
import ButtonSpinner from "../../common/spinner/buttonSpinner";

const styles = require("./setting.scss");

export interface ISettingProps {
  isLoading: boolean;
  isValidUser: boolean;
  previousInstitution: string;
  institutionInput: string;
  previousMajor: string;
  majorInput: string;
  handlePassInvalidUser: () => void;
  changeMajorInput: (major: string) => void;
  changeInstitutionInput: (institution: string) => void;
  updateCurrentUserProfile: () => void;
}

function getUpdateBtn(props: ISettingProps) {
  let { previousInstitution, institutionInput, previousMajor, majorInput } = props;

  if (previousInstitution === null) previousInstitution = "";
  if (institutionInput === null) institutionInput = "";
  if (previousMajor === null) previousMajor = "";
  if (majorInput === null) majorInput = "";

  const isInputChangeExist = previousInstitution !== institutionInput || previousMajor !== majorInput;
  if (props.isLoading) {
    return (
      <div className={styles.loadingBtn}>
        <ButtonSpinner className={styles.buttonSpinner} />
        Update
      </div>
    );
  } else if (isInputChangeExist) {
    return (
      <div onClick={props.updateCurrentUserProfile} tabIndex={0} className={styles.updateBtn}>
        Update
      </div>
    );
  } else {
    return <div className={`${styles.updateBtn} ${styles.inActiveUpdateBtn}`}>Update</div>;
  }
}

type UPDATE_BTN_TYPE = "institution" | "major";

function getUpdateBtnContainer(props: ISettingProps, type: UPDATE_BTN_TYPE) {
  let inputValue: string;
  let onChangeFunc: (value: string) => void;
  switch (type) {
    case "institution":
      inputValue = props.institutionInput || "";
      onChangeFunc = props.changeInstitutionInput;
      break;
    case "major":
      inputValue = props.majorInput || "";
      onChangeFunc = props.changeMajorInput;
      break;
    default:
      break;
  }

  return <InputBox onChangeFunc={onChangeFunc} type="short" defaultValue={inputValue} />;
}

class Setting extends React.PureComponent<ISettingProps, {}> {
  public componentDidMount() {
    const { isValidUser, handlePassInvalidUser } = this.props;

    if (!isValidUser) {
      alert("You are not valid user to access this page.");
      handlePassInvalidUser();
    }
  }

  public render() {
    return (
      <div className={styles.settingContainer}>
        <div className={styles.title}>Additional Information Settings</div>
        <div className={styles.smallTitle}>Institution</div>
        {getUpdateBtnContainer(this.props, "institution")}
        <div className={styles.smallTitle}>Major</div>
        {getUpdateBtnContainer(this.props, "major")}
        <div className={styles.separatorLine} />
        {getUpdateBtn(this.props)}
      </div>
    );
  }
}

export default Setting;
