import * as React from "react";
import SearchQueryContent from "../../../common/searchQueryContent";
const styles = require("./title.scss");

export interface ITitleProps {
  title: string;
  searchQueryText: string;
  openSourceLink: () => void;
  isTitleVisited: boolean;
  visitTitle: () => void;
}

const Title = (props: ITitleProps) => {
  const trimmedTitle = props.title
    .replace(/^ /gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/#[A-Z0-9]+#/g, "");

  if (!props.searchQueryText) {
    return (
      <div
        onClick={() => {
          props.openSourceLink();
          props.visitTitle();
        }}
        className={props.isTitleVisited ? `${styles.title} ${styles.isVisited}` : styles.title}
      >
        {trimmedTitle}
      </div>
    );
  } else {
    return (
      <SearchQueryContent
        content={trimmedTitle}
        searchQueryText={props.searchQueryText}
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
