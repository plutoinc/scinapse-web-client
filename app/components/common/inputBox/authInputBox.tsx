import * as React from "react";
import Icon from "../../../icons";

const styles = require("./authInputBox.scss");

interface IAuthInputBoxParams {
  onFocusFunc: () => void;
  onChangeFunc: (value: string) => void;
  onBlurFunc?: () => void;
  defaultValue?: string;
  placeHolder?: string;
  hasError?: boolean;
  inputType: string;
  iconName: string;
}

export const AuthInputBox = (params: IAuthInputBoxParams) => {
  return (
    <div className={params.hasError ? `${styles.formBox} ${styles.formError}` : styles.formBox}>
      <Icon className={styles.formBoxIconWrapper} icon={params.iconName} />
      <div className={styles.separatorLine} />
      <input
        onFocus={params.onFocusFunc}
        onChange={e => {
          params.onChangeFunc(e.currentTarget.value);
        }}
        onBlur={params.onBlurFunc}
        placeholder={params.placeHolder}
        className={`form-control ${styles.inputBox}`}
        value={params.defaultValue}
        type={params.inputType}
      />
    </div>
  );
};
