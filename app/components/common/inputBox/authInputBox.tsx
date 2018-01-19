import * as React from "react";
import Icon from "../../../icons";

const styles = require("./authInputBox.scss");

interface IAuthInputBoxProps {
  onFocused: boolean;
  onFocusFunc: () => void;
  onChangeFunc: (value: string) => void;
  onBlurFunc?: () => void;
  defaultValue?: string;
  placeHolder?: string;
  hasError?: boolean;
  inputType: string;
  iconName: string;
}

export const AuthInputBox = (props: IAuthInputBoxProps) => {
  const {
    onFocused,
    onFocusFunc,
    onChangeFunc,
    onBlurFunc,
    defaultValue,
    placeHolder,
    hasError,
    inputType,
    iconName,
  } = props;
  let formBoxClassName = styles.formBox;
  if (hasError) {
    formBoxClassName = `${styles.formBox} ${styles.formError}`;
  } else if (onFocused) {
    formBoxClassName = `${styles.formBox} ${styles.onFocusedInputBox}`;
  }

  return (
    <div className={formBoxClassName}>
      <Icon className={`${styles.formBoxIconWrapper} ${styles[iconName]}`} icon={iconName} />
      <input
        onFocus={onFocusFunc}
        onChange={e => {
          onChangeFunc(e.currentTarget.value);
        }}
        onBlur={onBlurFunc}
        placeholder={placeHolder}
        className={`form-control ${styles.inputBox}`}
        value={defaultValue}
        type={inputType}
      />
    </div>
  );
};
