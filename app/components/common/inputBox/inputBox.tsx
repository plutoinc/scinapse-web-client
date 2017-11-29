import * as React from "react";
import Icon from "../../../icons";
const styles = require("./inputBox.scss");

interface IInputBoxParams {
  onChangeFunc: (value: string) => void;
  onFocusFunc?: () => void;
  onBlurFunc?: () => void;
  type: INPUT_BOX_TYPE;
  defaultValue?: string;
  placeHolder?: string;
  hasError?: boolean;
  className?: string;
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

export const InputBox = (params: IInputBoxParams) => {
  let className: string = styles[`${params.type}InputWrapper`];

  if (params.className) {
    className = `${className} ${params.className}`;
  }

  if (params.hasError) {
    className = `${className} ${styles.hasError}`;
  }

  switch (params.type) {
    case "textarea":
      return (
        <div className={className}>
          <textarea
            onFocus={params.onFocusFunc}
            onChange={e => {
              params.onChangeFunc(e.currentTarget.value);
            }}
            placeholder={params.placeHolder}
            className={`form-control ${styles.inputBox}`}
            value={params.defaultValue}
          />
        </div>
      );

    case "headerSearch":
    case "search":
      return (
        <div className={className}>
          <input
            onFocus={params.onFocusFunc}
            onChange={e => {
              params.onChangeFunc(e.currentTarget.value);
            }}
            placeholder={params.placeHolder}
            className={`form-control ${styles.inputBox}`}
            value={params.defaultValue}
          />
          <Icon className={styles.searchIconWrapper} icon="SEARCH_ICON" />
        </div>
      );

    default:
      return (
        <div className={className}>
          <input
            onFocus={params.onFocusFunc}
            onChange={e => {
              params.onChangeFunc(e.currentTarget.value);
            }}
            onBlur={params.onBlurFunc}
            placeholder={params.placeHolder}
            className={`form-control ${styles.inputBox}`}
            value={params.defaultValue}
            type="text"
          />
        </div>
      );
  }
};
