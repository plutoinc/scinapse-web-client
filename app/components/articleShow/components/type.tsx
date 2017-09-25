import * as React from "react";
const styles = require("./type.scss");

export interface ITypeProps {
  tags: string;
}

const Type = (props: ITypeProps) => {
  return (
    <div className={styles.tagListWrapper}>
      <a className={styles.tagItem}>{props.tags}</a>
    </div>
  );
};

export default Type;
