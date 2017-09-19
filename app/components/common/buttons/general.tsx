import * as React from "react";
const styles = require("./general.scss");

interface IGeneralButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}

const GeneralButton = (props: IGeneralButtonProps) => {
  return (
    <button className={styles.generalButton} {...props}>
      {props.children}
    </button>
  );
};

export default GeneralButton;
