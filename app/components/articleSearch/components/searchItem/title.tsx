import * as React from "react";
import { escapeRegExp } from "lodash";
import { Link } from "react-router-dom";
import { stringify } from "qs";
import SearchQueryHighlightedContent from "../../../common/searchQueryHighlightedContent";
import { trackEvent } from "../../../../helpers/handleGA";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { PaperShowPageQueryParams } from "../../../paperShow";
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
    const queryParams: PaperShowPageQueryParams = { "ref-page": 1, "cited-page": 1 };
    const stringifiedQueryParams = stringify(queryParams, { addQueryPrefix: true });
    if (isNotExistSearchQueryText) {
      return (
        <Link
          to={{
            pathname: `/papers/${paperId}`,
            search: stringifiedQueryParams,
          }}
          onClick={() => {
            trackEvent({ category: "search-item", action: "click-title", label: `${paperId}` });
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
            trackEvent({ category: "search-item", action: "click-title", label: `${paperId}` });
          }}
          href={source}
          to={{
            pathname: `/papers/${paperId}`,
            search: stringifiedQueryParams,
          }}
        />
      );
    }
  }
}

export default withStyles<typeof Title>(styles)(Title);
