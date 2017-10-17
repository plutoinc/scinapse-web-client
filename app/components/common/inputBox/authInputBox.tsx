import * as React from "react";
import Icon from "../../../icons";

const styles = require("./authInputBox.scss");

interface IAuthInputBoxParams {
  onFocused: boolean;
  onFocusFunc: () => void;
  onChangeFunc: (value: string) => void;
  onBlurFunc?: () => void;
  defaultValue?: string;
  placeHolder?: string;
  hasError: boolean;
  inputType: string;
  iconName: string;
}

export const AuthInputBox = (params: IAuthInputBoxParams) => {
  let formBoxClassName = styles.formBox;
  if (params.hasError) {
    formBoxClassName = `${styles.formBox} ${styles.formError}`;
  } else if (params.onFocused) {
    formBoxClassName = `${styles.formBox} ${styles.onFocusedInputBox}`;
  }

  return (
    <div className={formBoxClassName}>
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
