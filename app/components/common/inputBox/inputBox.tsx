import * as React from "react";
const styles = require("./inputBox.scss");

interface IInputBoxParams {
  onChangeFunc: (value: string) => void;
  onBlurFunc?: () => void;
  type: string;
  defaultValue?: string;
  placeHolder?: string;
  hasError?: boolean;
}

export type INPUT_BOX_TYPE = "normal" | "textarea" | "authorName" | "authorInstitution";

export const InputBox = (params: IInputBoxParams) => {
  const className: string = `${params.type}InputWrapper`;
  switch (params.type) {
    case "textarea":
      return (
        <div className={params.hasError ? `${styles.hasError} ${styles[className]}` : styles[className]}>
          <textarea
            onChange={e => {
              params.onChangeFunc(e.currentTarget.value);
            }}
            placeholder={params.placeHolder}
            className={`form-control ${styles.inputBox} ${styles.hasError}`}
            value={params.defaultValue}
          />
        </div>
      );

    default:
      return (
        <div className={params.hasError ? `${styles.hasError} ${styles[className]}` : styles[className]}>
          <input
            onChange={e => {
              params.onChangeFunc(e.currentTarget.value);
            }}
            onBlur={params.onBlurFunc}
            placeholder={params.placeHolder}
            className={`form-control ${styles.inputBox} ${styles.hasError}`}
            value={params.defaultValue}
            type="text"
          />
        </div>
      );
  }
};
