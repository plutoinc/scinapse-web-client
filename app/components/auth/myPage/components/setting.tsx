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
      <div className={styles.updateBtnContainer}>
        <InputBox onChangeFunc={props.changeProfileImageInput} type="short" />
        <div tabIndex={0} className={styles.updateBtn}>
          Update
        </div>
      </div>

      <div className={styles.title}>Additional Information Settings</div>
      <div className={styles.smallTitle}>Institution</div>
      <div className={styles.updateBtnContainer}>
        <InputBox onChangeFunc={props.changeInstitutionInput} type="short" />
        <div tabIndex={0} className={styles.updateBtn}>
          Update
        </div>
      </div>
      <div className={styles.smallTitle}>Major</div>
      <div className={styles.updateBtnContainer}>
        <InputBox onChangeFunc={props.changeMajorInput} type="short" />
        <div tabIndex={0} className={styles.updateBtn}>
          Update
        </div>
      </div>
    </div>
  );
};

export default Setting;
