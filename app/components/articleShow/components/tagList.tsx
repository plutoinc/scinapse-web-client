import * as React from "react";
const styles = require("./tagList.scss");

export interface ITagListProps {
  tags: string[]; // TODO: Change tag type after setting the API
}

function mapTagItem(props: ITagListProps) {
  return props.tags.map((tag, index) => {
    return (
      <a key={tag + index} className={styles.tagItem}>
        {tag}
      </a>
    );
  });
}

const TagList = (props: ITagListProps) => {
  return <div className={styles.tagListWrapper}>{mapTagItem(props)}</div>;
};

export default TagList;
