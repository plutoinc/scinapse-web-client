import * as React from "react";
import SearchQueryContent from "../../../common/searchQueryContent";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
const styles = require("./title.scss");

export interface ITitleProps {
  title: string;
  searchQueryText: string;
  source: string;
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
      <a
        href={props.source}
        target="_blank"
        onClick={() => {
          trackAndOpenLink("searchItemTitle");
          props.visitTitle();
        }}
        className={props.isTitleVisited ? `${styles.title} ${styles.isVisited}` : styles.title}
      >
        {trimmedTitle}
      </a>
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
          trackAndOpenLink("searchItemTitle");
          props.visitTitle();
        }}
        href={props.source}
      />
    );
  }
};

export default Title;
