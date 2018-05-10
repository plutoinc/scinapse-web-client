import * as React from "react";
import SearchItem from "../searchItem";
import { PaperList, PaperRecord } from "../../../../model/paper";
import { SearchItemMetaList } from "../../records";
import { CurrentUserRecord } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { PostCommentsComponentParams, GetCommentsParams } from "../../../../api/types/comment";
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
  toggleAuthors: (index: number) => void;
  toggleComments: (index: number) => void;
  handlePostComment: (params: PostCommentsComponentParams) => void;
  getMoreComments: (params: GetCommentsParams) => void;
  deleteComment: (paperId: number, commentId: number) => void;
}

class SearchList extends React.PureComponent<SearchListProps, {}> {
  public render() {
    const { currentUser, papers, searchItemMetaList, searchQueryText } = this.props;

    const searchItems = papers.map((paper, index) => {
      return (
        <SearchItem
          key={`paper_${paper.id}`}
          paper={paper}
          setActiveCitationDialog={this.props.setActiveCitationDialog}
          toggleCitationDialog={this.props.toggleCitationDialog}
          isCommentsOpen={searchItemMetaList.getIn([index, "isCommentsOpen"])}
          toggleComments={() => {
            this.props.toggleComments(index);
          }}
          isAuthorsOpen={searchItemMetaList.getIn([index, "isAuthorsOpen"])}
          toggleAuthors={() => {
            this.props.toggleAuthors(index);
          }}
          isBookmarked={searchItemMetaList.getIn([index, "isBookmarked"])}
          handlePostBookmark={this.props.handlePostBookmark}
          handleRemoveBookmark={this.props.handleRemoveBookmark}
          handlePostComment={() => {
            this.props.handlePostComment({
              index,
              paperId: paper.id,
            });
          }}
          withComments={true}
          isLoading={searchItemMetaList.getIn([index, "isLoading"])}
          searchQueryText={searchQueryText}
          currentUser={currentUser}
          deleteComment={(commentId: number) => {
            this.props.deleteComment(paper.id, commentId);
          }}
          getMoreComments={() => {
            this.props.getMoreComments({
              paperId: paper.id,
              page: searchItemMetaList.getIn([index, "page"]),
            });
          }}
          isPageLoading={searchItemMetaList.getIn([index, "isPageLoading"])}
        />
      );
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  }
}

export default withStyles<typeof SearchList>(styles)(SearchList);
