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
  public constructor(props: SortBoxProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  public render() {
    return (
      <div className={styles.articleSortBoxWrapper}>
        <div className={styles.currentOption}>{this.getSortBoxItems()}</div>
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

  private getSortBoxItems = () => {
    const { sortOption, query } = this.props;

    const sortOptions: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS[] = [
      "RELEVANCE",
      "MOST_CITATIONS",
      "OLDEST_FIRST",
      "NEWEST_FIRST",
    ];

    const transformSortOptionsToHtml = sortOptions.map((sort, index) => {
      return (
        <Link
          key={index}
          to={{
            pathname: "/search",
            search: PaperSearchQueryFormatter.stringifyPapersQuery({
              query,
              page: 1,
              sort,
              filter: {},
            }),
          }}
          onClick={() => {
            this.handleActionTicketFireInSorting(sort);
          }}
          className={classNames({
            [styles.nonActiveSortOption]: true,
            [styles.activeSortOption]: sortOption === sort,
          })}
        >
          {this.getSortOptionToShow(sort)}
        </Link>
      );
    });

    return transformSortOptionsToHtml;
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
