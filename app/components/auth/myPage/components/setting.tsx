import * as React from "react";
import { InputBox } from "../../../common/inputBox/inputBox";

const styles = require("./setting.scss");

export interface ISettingProps {
  profileImage: string;
  changeProfileImageInput: (profileImage: string) => void;
  institution: string;
  changeInstitutionInput: (institution: string) => void;
  major: string;
  changeMajorInput: (major: string) => void;
}

const Setting = (props: ISettingProps) => {
  return (
    <div>
      <div className={styles.title}>Public Profile Settings</div>
      <div className={styles.smallTitle}>Profile image URL</div>
      <InputBox onChangeFunc={props.changeProfileImageInput} type="normal" />
      <div className={styles.title}>Additional Information Settings</div>
      <div className={styles.smallTitle}>Institution</div>
      <InputBox onChangeFunc={props.changeInstitutionInput} type="normal" />
      <div className={styles.smallTitle}>Major</div>
      <InputBox onChangeFunc={props.changeMajorInput} type="normal" />
    </div>
  );
};

export default Setting;
