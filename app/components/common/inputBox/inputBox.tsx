import * as React from "react";
import Icon from "../../../icons";

const styles = require("./inputBox.scss");

interface IInputBoxProps {
  onChangeFunc: (value: string) => void;
  onFocusFunc?: () => void;
  onBlurFunc?: () => void;
  onClickFunc?: (e?: React.FormEvent<HTMLFormElement | HTMLDivElement>) => void;
  type: INPUT_BOX_TYPE;
  defaultValue?: string;
  placeHolder?: string;
  hasError?: boolean;
  className?: string;
}

export type INPUT_BOX_TYPE = "normal" | "headerSearch" | "search";

export const InputBox = (props: IInputBoxProps) => {
  const {
    onChangeFunc,
    onFocusFunc,
    onBlurFunc,
    onClickFunc,
    type,
    defaultValue,
    placeHolder,
    hasError,
    className,
  } = props;

  let inputBoxClassName: string = styles[`${type}InputWrapper`];

  if (className) {
    inputBoxClassName = `${inputBoxClassName} ${className}`;
  }

  if (hasError) {
    inputBoxClassName = `${inputBoxClassName} ${styles.hasError}`;
  }

  switch (type) {
    case "headerSearch":
    case "search":
      return (
        <div className={inputBoxClassName}>
          <input
            onFocus={onFocusFunc}
            onChange={e => {
              onChangeFunc(e.currentTarget.value);
            }}
            placeholder={placeHolder}
            className={`form-control ${styles.inputBox}`}
            value={defaultValue}
          />
          <div onClick={onClickFunc} className={styles.searchIconWrapper}>
            <Icon icon="SEARCH_ICON" />
          </div>
        </div>
      );

    default:
      return (
        <div className={inputBoxClassName}>
          <input
            onFocus={onFocusFunc}
            onChange={e => {
              onChangeFunc(e.currentTarget.value);
            }}
            onBlur={onBlurFunc}
            placeholder={placeHolder}
            className={`form-control ${styles.inputBox}`}
            value={defaultValue}
            type="text"
          />
        </div>
      );
  }
};
