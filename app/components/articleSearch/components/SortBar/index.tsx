import * as React from "react";
import * as classNames from "classnames";
import { Link } from "react-router-dom";
import PaperSearchQueryFormatter, { FilterObject } from "../../../../helpers/papersQueryFormatter";
import { withStyles } from "../../../../helpers/withStylesHelper";
import ActionTicketManager from "../../../../helpers/actionTicketManager";
const styles = require("./sortBar.scss");

const ARTICLE_SEARCH_SORT_OPTIONS: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS[] = [
  "RELEVANCE",
  "MOST_CITATIONS",
  "NEWEST_FIRST",
];

interface SortBarProps {
  query: string;
  sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
  filter: FilterObject;
}

function trackSorting(sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS) {
  ActionTicketManager.trackTicket({
    pageType: "searchResult",
    actionType: "fire",
    actionArea: "sortBar",
    actionTag: "paperSorting",
    actionLabel: sortOption,
  });
}

function getSortBarItems(props: SortBarProps) {
  const sortOption = props.sortOption;
  const query = props.query;
  const filter = props.filter;

  const sortOptionNodes = ARTICLE_SEARCH_SORT_OPTIONS.map((sort, index) => {
    return (
      <Link
        key={index}
        to={{
          pathname: "/search",
          search: PaperSearchQueryFormatter.stringifyPapersQuery({
            query,
            page: 1,
            sort,
            filter,
          }),
        }}
        onClick={() => {
          trackSorting(sort);
        }}
        className={classNames({
          [styles.nonActiveSortOption]: true,
          [styles.activeSortOption]: sortOption === sort,
        })}
      >
        {getSortOptionToShow(sort)}
      </Link>
    );
  });

  return sortOptionNodes;
}

function getSortOptionToShow(sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS) {
  // tslint:disable-next-line:switch-default
  switch (sortOption) {
    case "RELEVANCE": {
      return "Relevance";
    }

    case "NEWEST_FIRST": {
      return "Newest";
    }

    case "MOST_CITATIONS": {
      return "Most Citations";
    }
  }
}

const SortBar: React.SFC<SortBarProps> = props => {
  return (
    <div className={styles.articleSortBarWrapper}>
      <div className={styles.currentOption}>{getSortBarItems(props)}</div>
    </div>
  );
};

export default withStyles<typeof SortBar>(styles)(SortBar);
