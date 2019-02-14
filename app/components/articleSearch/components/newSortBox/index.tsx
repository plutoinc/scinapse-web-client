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

function trackSorting(sortOption: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS) {
  ActionTicketManager.trackTicket({
    pageType: "searchResult",
    actionType: "fire",
    actionArea: "sortBox",
    actionTag: "paperSorting",
    actionLabel: sortOption,
  });
}

function getSortBoxItems(props: SortBoxProps) {
  const sortOption = props.sortOption;
  const query = props.query;

  const sortOptions: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS[] = ["RELEVANCE", "MOST_CITATIONS", "NEWEST_FIRST"];

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

  return transformSortOptionsToHtml;
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

const SortBox: React.SFC<SortBoxProps> = props => {
  return (
    <div className={styles.articleSortBoxWrapper}>
      <div className={styles.currentOption}>{getSortBoxItems(props)}</div>
    </div>
  );
};

export default withStyles<typeof SortBox>(styles)(SortBox);
