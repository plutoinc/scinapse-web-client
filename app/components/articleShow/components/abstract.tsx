import * as React from "react";
const styles = require("./abstract.scss");

export interface IAbstractProps {
  content: string;
}

const Abstract = (props: IAbstractProps) => {
  return (
    <div className={styles.abstractWrapper}>
      <div className={styles.title}>Abstract</div>
      <div className={styles.content}>{props.content}</div>
    </div>
  );
};

export default Abstract;
