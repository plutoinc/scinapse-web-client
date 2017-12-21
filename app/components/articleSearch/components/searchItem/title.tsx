import * as React from "react";
import SearchQueryContent from "../../../common/searchQueryContent";
const styles = require("./title.scss");

export interface ITitleProps {
  title: string;
  searchQuery: string;
  openSourceLink: () => void;
  isTitleVisited: boolean;
  visitTitle: () => void;
}

const Title = (props: ITitleProps) => {
  if (!props.searchQuery) {
    return (
      <div
        onClick={() => {
          props.openSourceLink();
          props.visitTitle();
        }}
        className={props.isTitleVisited ? `${styles.title} ${styles.isVisited}` : styles.title}
      >
        {props.title}
      </div>
    );
  } else {
    return (
      <SearchQueryContent
        content={props.title}
        searchQuery={props.searchQuery}
        nameForKey="title"
        className={props.isTitleVisited ? `${styles.title} ${styles.isVisited}` : styles.title}
        searchQueryClassName={styles.searchQuery}
        onClickFunc={() => {
          props.openSourceLink();
          props.visitTitle();
        }}
      />
    );
  }
};

export default Title;
