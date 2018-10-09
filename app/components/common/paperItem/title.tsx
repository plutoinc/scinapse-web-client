import * as React from "react";
import { escapeRegExp } from "lodash";
import { Link } from "react-router-dom";
import SearchQueryHighlightedContent from "../searchQueryHighlightedContent";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./title.scss");

export interface TitleProps {
  title: string;
  paperId: number;
  source: string;
  searchQueryText?: string;
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

    const noSearchQueryText = !searchQueryText;
    const searchQuery = escapeRegExp(searchQueryText);
    if (noSearchQueryText) {
      return (
        <div>
          <Link
            to={{
              pathname: `/papers/${paperId}`,
            }}
            onClick={() => {
              trackEvent({
                category: "Flow to Paper Show",
                action: "Click Title",
                label: "",
              });
            }}
            className={styles.title}
          >
            <span>{trimmedTitle}</span>
          </Link>
          <a className={styles.newTabIconWrapper} href={`/papers/${paperId}`} target="_blank">
            <Icon className={styles.newTabIcon} icon="EXTERNAL_SOURCE" />
          </a>
        </div>
      );
    }
    return (
      <div>
        <SearchQueryHighlightedContent
          content={trimmedTitle}
          searchQueryText={searchQuery}
          className={styles.title}
          onClickFunc={() => {
            trackEvent({
              category: "Flow to Paper Show",
              action: "Click Title",
              label: "",
            });
          }}
          href={source}
          to={{
            pathname: `/papers/${paperId}`,
          }}
        />
        <a className={styles.newTabIconWrapper} href={`/papers/${paperId}`} target="_blank">
          <Icon className={styles.newTabIcon} icon="EXTERNAL_SOURCE" />
        </a>
      </div>
    );
  }
}

export default withStyles<typeof Title>(styles)(Title);
