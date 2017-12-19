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
import { IPaperRecord } from "../../../../model/paper";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { trackAndOpenLink } from "../../../../helpers/handleGA";

// const shave = require("shave").default;
const styles = require("./searchItem.scss");

export interface ISearchItemProps {
  paper: IPaperRecord;
  commentInput: string;
  changeCommentInput: (comment: string) => void;
  isAbstractOpen: Boolean;
  toggleAbstract: () => void;
  isCommentsOpen: Boolean;
  toggleComments: () => void;
  handleCommentPost: () => void;
  isLoading: Boolean;
  searchQuery: string;
  isFirstOpen: Boolean;
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
    commentInput,
    isAbstractOpen,
    toggleAbstract,
    changeCommentInput,
    toggleComments,
    handleCommentPost,
    isLoading,
    searchQuery,
    isFirstOpen,
    closeFirstOpen,
    currentUser,
    deleteComment,
  } = props;
  const { title, venue, authors, year, fosList, citedCount, referenceCount, doi, id, abstract, comments } = props.paper;

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
        <PublishInfoList journal={venue} year={year} authors={authors} />
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
