import * as React from "react";
import * as _ from "lodash";
import SearchQueryHighlightedContent from "../../../common/searchQueryHighlightedContent";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./title.scss");

export interface TitleProps {
  title: string;
  searchQueryText: string;
  source: string;
  isTitleVisited: boolean;
  visitTitle: () => void;
}

const Title = (props: TitleProps) => {
  const { title, searchQueryText, source, isTitleVisited, visitTitle } = props;
  if (!title) {
    return null;
  }
  // for removing first or last space or trash value of content
  const trimmedTitle = title
    .replace(/^ /gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/#[A-Z0-9]+#/g, "");
  const isNotExistSearchQueryText = !searchQueryText;
  const searchQuery = _.escapeRegExp(searchQueryText);

  if (isNotExistSearchQueryText) {
    return (
      <a
        href={source}
        target="_blank"
        onClick={() => {
          trackAndOpenLink("searchItemTitle");
          visitTitle();
        }}
        className={isTitleVisited ? `${styles.title} ${styles.isVisited}` : styles.title}
      >
        {trimmedTitle}
      </a>
    );
  } else {
    return (
      <SearchQueryHighlightedContent
        content={trimmedTitle}
        searchQueryText={searchQuery}
        nameForKey="title"
        className={isTitleVisited ? `${styles.title} ${styles.isVisited}` : styles.title}
        searchQueryClassName={styles.searchQuery}
        onClickFunc={() => {
          trackAndOpenLink("searchItemTitle");
          visitTitle();
        }}
        href={source}
      />
    );
  }
};

export default withStyles<typeof Title>(styles)(Title);
