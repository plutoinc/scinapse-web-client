import * as React from "react";
import SearchQueryContent from "../../../common/searchQueryContent";
const styles = require("./title.scss");

export interface ITitleProps {
  title: string;
  searchQuery: string;
}

const Title = (props: ITitleProps) => {
  if (!props.searchQuery) {
    return <div className={styles.title}>{props.title}</div>;
  } else {
    return (
      <SearchQueryContent
        content={props.title}
        searchQuery={props.searchQuery}
        nameForKey="title"
        className={styles.title}
        searchQueryClassName={styles.searchQuery}
      />
    );
  }
};

export default Title;
