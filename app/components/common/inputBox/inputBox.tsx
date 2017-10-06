import * as React from "react";
const styles = require("./inputBox.scss");

interface IInputBoxParams {
  onChangeFunc: (value: string) => void;
  validateFunc?: (value: string) => void;
  type: string;
  placeHolder?: string;
  hasError?: boolean;
}

export type INPUT_BOX_TYPE = "big" | "long" | "White Paper" | "Tech Blog";

export const InputBox = (params: IInputBoxParams) => {
  const className: string = `${params.type}InputWrapper`;

  return (
    <div className={params.hasError ? `${styles.hasError} ${styles[className]}` : styles[className]}>
      <input
        onChange={e => {
          params.onChangeFunc(e.currentTarget.value);
          params.validateFunc(e.currentTarget.value);
        }}
        placeholder={params.placeHolder}
        className={`form-control ${styles.inputBox} ${styles.hasError}`}
        type="text"
      />
    </div>
  );
};
