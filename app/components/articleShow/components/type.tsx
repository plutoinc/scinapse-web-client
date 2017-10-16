import * as React from "react";
const styles = require("./type.scss");

export interface ITypeProps {
  tag: string;
}

const Type = (props: ITypeProps) => {
  const tag = props.tag.replace(/_/g, " ");

  return (
    <div className={styles.tagListWrapper}>
      <a className={styles.tagItem}>{tag}</a>
    </div>
  );
};

export default Type;
