import * as React from "react";
import Keywords from "./keywords";
import InfoList from "./infoList";
import Comments from "./comments";
import CommentInput from "./commentInput";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";
import Title from "./title";

import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { IPaperRecord } from "../../../../model/paper";
import { IPaperSourceRecord } from "../../../../model/paperSource";
import { ICurrentUserRecord } from "../../../../model/currentUser";

const styles = require("./searchItem.scss");

export interface ISearchItemProps {
  paper: IPaperRecord;
  commentInput: string;
  changeCommentInput: (comment: string) => void;
  isAbstractOpen: boolean;
  toggleAbstract: () => void;
  isCommentsOpen: boolean;
  toggleComments: () => void;
  isAuthorsOpen: boolean;
  toggleAuthors: () => void;
  isTitleVisited: boolean;
  visitTitle: () => void;
  handlePostComment: () => void;
  isLoading: boolean;
  searchQueryText: string;
  isFirstOpen: boolean;
  closeFirstOpen: () => void;
  currentUser: ICurrentUserRecord;
  deleteComment: (commentId: number) => void;
  getMoreComments: () => void;
  isPageLoading: boolean;
}

const mockCitedPaperAvgIF = 2.22;
const mockPlutoScore = 234;

const SearchItem = (props: ISearchItemProps) => {
  const {
    isCommentsOpen,
    toggleComments,
    isAuthorsOpen,
    toggleAuthors,
    commentInput,
    isAbstractOpen,
    toggleAbstract,
    changeCommentInput,
    handlePostComment,
    isLoading,
    searchQueryText,
    isFirstOpen,
    closeFirstOpen,
    currentUser,
    deleteComment,
    isTitleVisited,
    visitTitle,
    getMoreComments,
    isPageLoading,
  } = props;
  const {
    title,
    venue,
    authors,
    year,
    fosList,
    citedCount,
    referenceCount,
    doi,
    id,
    abstract,
    comments,
    urls,
    commentCount,
    journal,
  } = props.paper;

  const pdfSourceRecord = urls.find((paperSource: IPaperSourceRecord) => {
    if (paperSource.url.includes(".pdf")) return true;
  });
  let pdfSourceUrl;

  if (!!pdfSourceRecord) {
    pdfSourceUrl = pdfSourceRecord.url;
  }

  let source;
  if (!!doi) {
    source = `https://dx.doi.org/${doi}`;
  } else if (urls.size > 0) {
    source = urls.getIn([0, "url"]);
  }

  return (
    <div className={styles.searchItemWrapper}>
      <div className={styles.contentSection}>
        <Title
          title={title}
          searchQueryText={searchQueryText}
          source={source}
          isTitleVisited={isTitleVisited}
          visitTitle={visitTitle}
        />
        <PublishInfoList
          journalName={!!journal ? journal.fullTitle : venue}
          journalIF={!!journal ? journal.impactFactor : null}
          year={year}
          authors={authors}
          isAuthorsOpen={isAuthorsOpen}
          toggleAuthors={toggleAuthors}
        />
        <Abstract
          abstract={abstract}
          isAbstractOpen={isAbstractOpen}
          toggleAbstract={toggleAbstract}
          searchQueryText={searchQueryText}
          isFirstOpen={isFirstOpen}
          closeFirstOpen={closeFirstOpen}
        />
        <Keywords keywords={fosList} />
        <InfoList
          referenceCount={referenceCount}
          citedCount={citedCount}
          citedPaperAvgIF={mockCitedPaperAvgIF}
          plutoScore={mockPlutoScore}
          DOI={doi}
          articleId={id}
          searchQueryText={searchQueryText}
          pdfSourceUrl={pdfSourceUrl}
        />
        <CommentInput
          isLoading={isLoading}
          isCommentsOpen={isCommentsOpen}
          checkAuthDialog={checkAuthDialog}
          commentInput={commentInput}
          changeCommentInput={changeCommentInput}
          toggleComments={toggleComments}
          handlePostComment={handlePostComment}
          commentCount={commentCount}
        />
        <Comments
          currentUser={currentUser}
          comments={comments}
          isCommentsOpen={isCommentsOpen}
          deleteComment={deleteComment}
          commentCount={commentCount}
          getMoreComments={getMoreComments}
          isPageLoading={isPageLoading}
        />
      </div>
    </div>
  );
};

export default SearchItem;
