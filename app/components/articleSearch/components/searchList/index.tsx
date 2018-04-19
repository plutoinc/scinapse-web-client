import * as React from "react";
import SearchItem from "../searchItem";
import { PaperList, PaperRecord } from "../../../../model/paper";
import { SearchItemMetaList } from "../../records";
import { CurrentUserRecord } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { PostCommentsComponentParams, GetCommentsComponentParams } from "../../../../api/types/comment";
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
  changeCommentInput: (index: number, comment: string) => void;
  toggleAbstract: (index: number) => void;
  toggleAuthors: (index: number) => void;
  visitTitle: (index: number) => void;
  closeFirstOpen: (index: number) => void;
  toggleComments: (index: number) => void;
  handlePostComment: (params: PostCommentsComponentParams) => void;
  getMoreComments: (params: GetCommentsComponentParams) => void;
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
          commentInput={searchItemMetaList.getIn([index, "commentInput"])}
          changeCommentInput={(comment: string) => {
            this.props.changeCommentInput(index, comment);
          }}
          isAbstractOpen={searchItemMetaList.getIn([index, "isAbstractOpen"])}
          toggleAbstract={() => {
            this.props.toggleAbstract(index);
          }}
          isCommentsOpen={searchItemMetaList.getIn([index, "isCommentsOpen"])}
          toggleComments={() => {
            this.props.toggleComments(index);
          }}
          isAuthorsOpen={searchItemMetaList.getIn([index, "isAuthorsOpen"])}
          toggleAuthors={() => {
            this.props.toggleAuthors(index);
          }}
          isTitleVisited={searchItemMetaList.getIn([index, "isTitleVisited"])}
          visitTitle={() => {
            this.props.visitTitle(index);
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
          isFirstOpen={searchItemMetaList.getIn([index, "isFirstOpen"])}
          closeFirstOpen={() => {
            this.props.closeFirstOpen(index);
          }}
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
