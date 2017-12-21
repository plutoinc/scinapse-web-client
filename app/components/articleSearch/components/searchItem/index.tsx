import * as React from "react";
//Components
import Keywords from "./keywords";
import InfoList from "./infoList";
import Comments from "./comments";
import CommentInput from "./commentInput";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";
import Title from "./title";

import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { IPaperRecord, IPaperSourceRecord } from "../../../../model/paper";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { trackAndOpenLink } from "../../../../helpers/handleGA";

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
  handleCommentPost: () => void;
  isLoading: boolean;
  searchQuery: string;
  isFirstOpen: boolean;
  closeFirstOpen: () => void;
  currentUser: ICurrentUserRecord;
  deleteComment: (commentId: number) => void;
}

const mockCitedPaperAvgIF = 2.22;
const mockPlutoScore = 234;

function openSourceLink(props: ISearchItemProps) {
  const { doi, urls } = props.paper;
  let source;
  if (!!doi) {
    source = `https://dx.doi.org/${doi}`;
  } else if (urls.size > 0) {
    source = urls.getIn([0, "url"]);
  }

  trackAndOpenLink(source, "searchItemSource");
}

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
    handleCommentPost,
    isLoading,
    searchQuery,
    isFirstOpen,
    closeFirstOpen,
    currentUser,
    deleteComment,
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
  } = props.paper;

  const pdfSourceRecord = urls.find((paperSource: IPaperSourceRecord) => {
    if (paperSource.url.includes("pdf")) return true;
  });
  let pdfSourceUrl;
  if (!!pdfSourceRecord) {
    pdfSourceUrl = pdfSourceRecord.url;
  }

  return (
    <div className={styles.searchItemWrapper}>
      <div className={styles.contentSection}>
        <Title
          title={title}
          searchQuery={searchQuery}
          openSourceLink={() => {
            openSourceLink(props);
          }}
        />
        <PublishInfoList
          journal={venue}
          year={year}
          authors={authors}
          isAuthorsOpen={isAuthorsOpen}
          toggleAuthors={toggleAuthors}
        />
        <Abstract
          abstract={abstract}
          isAbstractOpen={isAbstractOpen}
          toggleAbstract={toggleAbstract}
          searchQuery={searchQuery}
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
          openSourceLink={() => {
            openSourceLink(props);
          }}
          searchQuery={searchQuery}
          pdfSourceUrl={pdfSourceUrl}
        />
        <CommentInput
          isLoading={isLoading}
          isCommentsOpen={isCommentsOpen}
          commentCount={comments.size}
          checkAuthDialog={checkAuthDialog}
          commentInput={commentInput}
          changeCommentInput={changeCommentInput}
          toggleComments={toggleComments}
          handleCommentPost={handleCommentPost}
          commentsSize={comments.size}
        />
        <Comments
          currentUser={currentUser}
          comments={comments}
          isCommentsOpen={isCommentsOpen}
          deleteComment={deleteComment}
        />
      </div>
    </div>
  );
};

export default SearchItem;
