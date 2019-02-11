import * as React from "react";
import { Link } from "react-router-dom";
import PaperSearchQueryFormatter from "../../../../helpers/papersQueryFormatter";
import { withStyles } from "../../../../helpers/withStylesHelper";
import ActionTicketManager from "../../../../helpers/actionTicketManager";
import * as classNames from "classnames";
const styles = require("./newSortBox.scss");

interface SortBoxProps {
  query: string;
  sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
}

class SortBox extends React.PureComponent<SortBoxProps> {
  private anchorElement: HTMLDivElement | null;

  public constructor(props: SortBoxProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  public render() {
    const { sortOption, query } = this.props;

    return (
      <div className={styles.articleSortBoxWrapper}>
        <div ref={el => (this.anchorElement = el)} className={styles.currentOption}>
          <Link
            to={{
              pathname: "/search",
              search: PaperSearchQueryFormatter.stringifyPapersQuery({
                query,
                page: 1,
                sort: "RELEVANCE",
                filter: {},
              }),
            }}
            onClick={() => {
              this.handleActionTicketFireInSorting("RELEVANCE");
            }}
            className={classNames({
              [styles.nonActiveSortOption]: true,
              [styles.activeSortOption]: sortOption === "RELEVANCE",
            })}
          >
            Relevance
          </Link>
          <Link
            to={{
              pathname: "/search",
              search: PaperSearchQueryFormatter.stringifyPapersQuery({
                query,
                page: 1,
                sort: "MOST_CITATIONS",
                filter: {},
              }),
            }}
            onClick={() => {
              this.handleActionTicketFireInSorting("MOST_CITATIONS");
            }}
            className={classNames({
              [styles.nonActiveSortOption]: true,
              [styles.activeSortOption]: sortOption === "MOST_CITATIONS",
            })}
          >
            Most Citations
          </Link>
          <Link
            to={{
              pathname: "/search",
              search: PaperSearchQueryFormatter.stringifyPapersQuery({
                query,
                page: 1,
                sort: "OLDEST_FIRST",
                filter: {},
              }),
            }}
            onClick={() => {
              this.handleActionTicketFireInSorting("OLDEST_FIRST");
            }}
            className={classNames({
              [styles.nonActiveSortOption]: true,
              [styles.activeSortOption]: sortOption === "OLDEST_FIRST",
            })}
          >
            Oldest
          </Link>
          <Link
            to={{
              pathname: "/search",
              search: PaperSearchQueryFormatter.stringifyPapersQuery({
                query,
                page: 1,
                sort: "NEWEST_FIRST",
                filter: {},
              }),
            }}
            onClick={() => {
              this.handleActionTicketFireInSorting("NEWEST_FIRST");
            }}
            className={classNames({
              [styles.nonActiveSortOption]: true,
              [styles.activeSortOption]: sortOption === "NEWEST_FIRST",
            })}
          >
            Newest
          </Link>
        </div>
      </div>
    );
  }

  private handleActionTicketFireInSorting = (sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS) => {
    ActionTicketManager.trackTicket({
      pageType: "searchResult",
      actionType: "fire",
      actionArea: "sortBox",
      actionTag: "paperSorting",
      actionLabel: sortOption,
    });
  };

  private getSortOptionToShow = (sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS) => {
    // tslint:disable-next-line:switch-default
    switch (sortOption) {
      case "RELEVANCE": {
        return "Relevance";
      }

      case "MOST_CITATIONS": {
        return "Most Citations";
      }

      case "OLDEST_FIRST": {
        return "Oldest";
      }

      case "NEWEST_FIRST": {
        return "Newest";
      }
    }
  };
}

export default withStyles<typeof SortBox>(styles)(SortBox);
