import * as React from "react";
import { escapeRegExp } from "lodash";
import { Link } from "react-router-dom";
import SearchQueryHighlightedContent from "../../../common/searchQueryHighlightedContent";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./title.scss");

export interface TitleProps {
  title: string;
  paperId: number;
  searchQueryText: string;
  source: string;
}

class Title extends React.PureComponent<TitleProps, {}> {
  public render() {
    const { title, paperId, searchQueryText, source } = this.props;

    if (!title) {
      return null;
    }
    // for removing first or last space or trash value of content
    const trimmedTitle = title
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");
    const isNotExistSearchQueryText = !searchQueryText;
    const searchQuery = escapeRegExp(searchQueryText);

    if (isNotExistSearchQueryText) {
      return (
        <Link
          to={`/papers/${paperId}`}
          onClick={() => {
            trackAndOpenLink("searchItemTitle");
          }}
          className={styles.title}
        >
          <span>{trimmedTitle}</span>
        </Link>
      );
    } else {
      return (
        <SearchQueryHighlightedContent
          content={trimmedTitle}
          searchQueryText={searchQuery}
          className={styles.title}
          onClickFunc={() => {
            trackAndOpenLink("searchItemTitle");
          }}
          href={source}
          to={`/papers/${paperId}`}
        />
      );
    }
  }
}

export default withStyles<typeof Title>(styles)(Title);
