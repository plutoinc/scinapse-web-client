import * as React from "react";
import { IconMenu, IconButton, MenuItem } from "material-ui";
import Keywords from "./keywords";
import InfoList from "./infoList";
import Comments from "./comments";
import CommentInput from "./commentInput";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";
import Title from "./title";
import Icon from "../../../../icons";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { PaperRecord } from "../../../../model/paper";
import { IPaperSourceRecord } from "../../../../model/paperSource";
import { CurrentUserRecord } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import EnvChecker from "../../../../helpers/envChecker";
const styles = require("./searchItem.scss");

export interface SearchItemProps {
  paper: PaperRecord;
  isAbstractOpen: boolean;
  toggleAbstract: () => void;
  isAuthorsOpen: boolean;
  toggleAuthors: () => void;
  isTitleVisited: boolean;
  visitTitle: () => void;
  searchQueryText: string;
  isFirstOpen: boolean;
  closeFirstOpen: () => void;
  currentUser: CurrentUserRecord;
  isPageLoading: boolean;
  withComments: boolean;
  isLoading?: boolean;
  commentInput?: string;
  isCommentsOpen?: boolean;
  toggleComments?: () => void;
  handlePostComment?: () => void;
  changeCommentInput?: (comment: string) => void;
  deleteComment?: (commentId: number) => void;
  getMoreComments?: () => void;
}

const mockCitedPaperAvgIF = 2.22;
const mockPlutoScore = 234;

interface HandleClickClaim {
  paperId: number;
  cognitiveId?: number;
}

function handleClickClaim({ paperId, cognitiveId }: HandleClickClaim) {
  const targetId = cognitiveId ? `c_${cognitiveId}` : paperId;

  if (!EnvChecker.isServer()) {
    window.open(
      `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${targetId}&entry.1298741478`,
      "_blank",
    );
  }
}

const SearchItem = (props: SearchItemProps) => {
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
    paper,
    withComments,
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
    cognitivePaperId,
  } = paper;

  const pdfSourceRecord = urls.find((paperSource: IPaperSourceRecord) => {
    return paperSource.url.includes(".pdf");
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

  let commentNode = null;
  if (withComments) {
    commentNode = (
      <div>
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
    );
  }

  return (
    <div className={styles.searchItemWrapper}>
      <div className={styles.contentSection}>
        <div className={styles.titleWrapper}>
          <Title
            title={title}
            paperId={paper.id}
            searchQueryText={searchQueryText}
            source={source}
            isTitleVisited={isTitleVisited}
            visitTitle={visitTitle}
          />

          <IconMenu
            iconButtonElement={
              <IconButton style={{ width: 40, height: "auto" }}>
                <Icon className={styles.ellipsisIcon} icon="ELLIPSIS" />
              </IconButton>
            }
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            targetOrigin={{ horizontal: "right", vertical: "bottom" }}
            className={styles.claimButton}
          >
            <MenuItem
              style={{
                color: "#f54b5e",
              }}
              primaryText="Claim"
              onClick={() => {
                handleClickClaim({ paperId: id, cognitiveId: cognitivePaperId });
              }}
            />
          </IconMenu>
        </div>
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
          cognitiveId={cognitivePaperId}
          searchQueryText={searchQueryText}
          pdfSourceUrl={pdfSourceUrl}
          source={source}
        />
        {commentNode}
      </div>
    </div>
  );
};

export default withStyles<typeof SearchItem>(styles)(SearchItem);
