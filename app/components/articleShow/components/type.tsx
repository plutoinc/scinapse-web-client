import * as React from "react";
const styles = require("./type.scss");

export interface ITypeProps {
  tag: string;
}

const Type = (props: ITypeProps) => {
  return (
    <div className={styles.tagListWrapper}>
      <a className={styles.tagItem}>{props.tag}</a>
    </div>
  );
};

export default Type;
