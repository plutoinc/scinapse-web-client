import * as React from "react";
import Icon from "../../../icons";
import AutoSizeTextarea from "../autoSizeTextarea";
const styles = require("./inputBox.scss");

interface IInputBoxProps {
  onChangeFunc: (value: string) => void;
  onFocusFunc?: () => void;
  onBlurFunc?: () => void;
  onClickFunc?: () => void;
  onKeyDownFunc?: ((e: React.KeyboardEvent<HTMLTextAreaElement>) => void);
  type: INPUT_BOX_TYPE;
  defaultValue?: string;
  placeHolder?: string;
  hasError?: boolean;
  className?: string;
  disabled?: boolean;
}

export type INPUT_BOX_TYPE =
  | "normal"
  | "short"
  | "textarea"
  | "authorName"
  | "authorInstitution"
  | "headerSearch"
  | "search"
  | "comment";

export const InputBox = (props: IInputBoxProps) => {
  const {
    onChangeFunc,
    onFocusFunc,
    onBlurFunc,
    onClickFunc,
    onKeyDownFunc,
    type,
    defaultValue,
    placeHolder,
    hasError,
    className,
    disabled,
  } = props;

  let inputBoxClassName: string = styles[`${type}InputWrapper`];

  if (className) {
    inputBoxClassName = `${inputBoxClassName} ${className}`;
  }

  if (hasError) {
    inputBoxClassName = `${inputBoxClassName} ${styles.hasError}`;
  }

  switch (type) {
    case "textarea":
      return (
        <div className={inputBoxClassName}>
          <textarea
            onFocus={onFocusFunc}
            onChange={e => {
              onChangeFunc(e.currentTarget.value);
            }}
            onKeyDown={onKeyDownFunc}
            placeholder={placeHolder}
            className={`form-control ${styles.inputBox}`}
            value={defaultValue}
          />
        </div>
      );

    case "comment":
      return (
        <div className={inputBoxClassName}>
          <AutoSizeTextarea
            onFocus={onFocusFunc}
            onChange={e => {
              onChangeFunc(e.currentTarget.value);
            }}
            onKeyPress={onKeyDownFunc}
            placeholder={placeHolder}
            className={`form-control ${styles.inputBox}`}
            value={defaultValue}
            disabled={disabled}
          />
        </div>
      );

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
