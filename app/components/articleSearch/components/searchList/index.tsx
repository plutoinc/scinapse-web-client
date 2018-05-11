import * as React from "react";
import SearchItem from "../searchItem";
import { PaperList, PaperRecord } from "../../../../model/paper";
import { SearchItemMetaList } from "../../records";
import { CurrentUserRecord } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./searchList.scss");

interface SearchListProps {
  currentUser: CurrentUserRecord;
  papers: PaperList;
  searchItemMetaList: SearchItemMetaList;
  searchQueryText: string;
  handlePostBookmark: (paper: PaperRecord) => void;
  handleRemoveBookmark: (paper: PaperRecord) => void;
  setActiveCitationDialog?: (paperId: number) => void;
  toggleCitationDialog: () => void;
  checkVerifiedUser: () => boolean;
}

class SearchList extends React.PureComponent<SearchListProps, {}> {
  public render() {
    const { currentUser, papers, searchItemMetaList, searchQueryText } = this.props;

    const searchItems = papers.map((paper, index) => {
      return (
        <SearchItem
          key={`paper_${paper.id}`}
          paper={paper}
          checkVerifiedUser={this.props.checkVerifiedUser}
          setActiveCitationDialog={this.props.setActiveCitationDialog}
          toggleCitationDialog={this.props.toggleCitationDialog}
          handlePostBookmark={this.props.handlePostBookmark}
          handleRemoveBookmark={this.props.handleRemoveBookmark}
          withComments={true}
          isBookmarked={searchItemMetaList.getIn([index, "isBookmarked"])}
          searchQueryText={searchQueryText}
          currentUser={currentUser}
        />
      );
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  }
}

export default withStyles<typeof SearchList>(styles)(SearchList);
