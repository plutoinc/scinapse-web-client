import * as React from "react";
import { Paper } from "../../../../model/paper";
import { CurrentUser } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import PaperItem from "../../../common/paperItem";
const styles = require("./searchList.scss");

interface SearchListProps {
  currentUser: CurrentUser;
  papers: Paper[];
  searchQueryText: string;
  toggleAddCollectionDialog: (paperId: number) => void;
  setActiveCitationDialog?: (paperId: number) => void;
}

class SearchList extends React.PureComponent<SearchListProps> {
  public render() {
    const { currentUser, papers, searchQueryText, toggleAddCollectionDialog } = this.props;
    const searchItems =
      papers &&
      papers.map(paper => {
        if (paper) {
          return (
            <PaperItem
              key={`paper_${paper.id}`}
              paper={paper}
              toggleAddCollectionDialog={toggleAddCollectionDialog}
              searchQueryText={searchQueryText}
              currentUser={currentUser}
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
