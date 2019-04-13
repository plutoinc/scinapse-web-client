import * as React from "react";
import { Paper } from "../../../../model/paper";
import { CurrentUser } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import PaperItem from "../../../common/paperItem";
import ArticleSpinner from "../../../common/spinner/articleSpinner";
const styles = require("./searchList.scss");

interface SearchListProps {
  currentUser: CurrentUser;
  papers: Paper[];
  searchQueryText: string;
  isLoading: boolean;
  currentPage: number;
}

class SearchList extends React.PureComponent<SearchListProps> {
  public render() {
    const { currentUser, papers, searchQueryText, isLoading, currentPage } = this.props;

    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      );
    }

    const searchItems =
      papers &&
      papers.map(paper => {
        if (paper) {
          return (
            <PaperItem
              key={paper.id}
              paper={paper}
              pageType="searchResult"
              actionArea="searchResult"
              searchQueryText={searchQueryText}
              currentUser={currentUser}
              wrapperClassName={styles.searchItemWrapper}
              currentPage={currentPage}
            />
          );
        } else {
          return null;
        }
      });

    return <div className={styles.searchItems}>{searchItems}</div>;
  }
}

export default withStyles<typeof SearchList>(styles)(SearchList);
