import * as React from "react";
const styles = require("./tagList.scss");

export interface ITagListProps {
  tags: string;
}

const TagList = (props: ITagListProps) => {
  return (
    <div className={styles.tagListWrapper}>
      <a className={styles.tagItem}>{props.tags}</a>
    </div>
  );
};

export default TagList;
