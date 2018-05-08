import * as React from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
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
import { CurrentUserRecord } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import EnvChecker from "../../../../helpers/envChecker";
const styles = require("./searchItem.scss");

export interface SearchItemProps {
  paper: PaperRecord;
  isAuthorsOpen: boolean;
  toggleAuthors: () => void;
  searchQueryText: string;
  isBookmarked: boolean;
  currentUser: CurrentUserRecord;
  withComments: boolean;
  toggleCitationDialog: () => void;
  handlePostBookmark: (paper: PaperRecord) => void;
  handleRemoveBookmark: (paper: PaperRecord) => void;
  isLoading?: boolean;
  isPageLoading?: boolean;
  commentInput?: string;
  isCommentsOpen?: boolean;
  toggleComments?: () => void;
  handlePostComment?: () => void;
  changeCommentInput?: (comment: string) => void;
  setActiveCitationDialog?: (paperId: number) => void;
  deleteComment?: (commentId: number) => void;
  getMoreComments?: () => void;
}

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

class SearchItem extends React.Component<SearchItemProps, {}> {
  public shouldComponentUpdate(nextProps: SearchItemProps) {
    if (
      this.props.paper !== nextProps.paper ||
      this.props.isAuthorsOpen !== nextProps.isAuthorsOpen ||
      this.props.searchQueryText !== nextProps.searchQueryText ||
      this.props.isBookmarked !== nextProps.isBookmarked ||
      this.props.currentUser !== nextProps.currentUser ||
      this.props.withComments !== nextProps.withComments ||
      this.props.isLoading !== nextProps.isLoading ||
      this.props.isPageLoading !== nextProps.isPageLoading ||
      this.props.commentInput !== nextProps.commentInput ||
      this.props.isCommentsOpen !== nextProps.isCommentsOpen
    ) {
      return true;
    } else {
      return false;
    }
  }

  public render() {
    const {
      isCommentsOpen,
      toggleComments,
      isAuthorsOpen,
      toggleAuthors,
      commentInput,
      changeCommentInput,
      handlePostComment,
      isLoading,
      searchQueryText,
      currentUser,
      deleteComment,
      getMoreComments,
      isPageLoading,
      paper,
      withComments,
      toggleCitationDialog,
      setActiveCitationDialog,
      handlePostBookmark,
      isBookmarked,
      handleRemoveBookmark,
    } = this.props;
    const {
      title,
      venue,
      authors,
      year,
      fosList,
      doi,
      id,
      abstract,
      comments,
      urls,
      commentCount,
      journal,
      cognitivePaperId,
    } = paper;

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
            <Title title={title} paperId={paper.id} searchQueryText={searchQueryText} source={source} />

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
          <Abstract abstract={abstract} searchQueryText={searchQueryText} />
          <Keywords keywords={fosList} />
          <InfoList
            handleRemoveBookmark={handleRemoveBookmark}
            handlePostBookmark={handlePostBookmark}
            currentUser={currentUser}
            setActiveCitationDialog={setActiveCitationDialog}
            toggleCitationDialog={toggleCitationDialog}
            isBookmarked={isBookmarked}
            paper={paper}
          />
          {commentNode}
        </div>
      </div>
    );
  }
}

export default withStyles<typeof SearchItem>(styles)(SearchItem);
