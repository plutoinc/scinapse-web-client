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
}

class SearchList extends React.PureComponent<SearchListProps> {
  public render() {
    const { currentUser, papers, searchQueryText } = this.props;
    const searchItems =
      papers &&
      papers.map(paper => {
        if (paper) {
          return (
            <PaperItem
              key={paper.id}
              paper={paper}
              searchQueryText={searchQueryText}
              currentUser={currentUser}
              wrapperClassName={styles.searchItemWrapper}
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
