import * as React from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import { List } from "immutable";
import Keywords from "./keywords";
import InfoList from "./infoList";
import Comments from "./comments";
import CommentInput from "./commentInput";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";
import Title from "./title";
import CommentAPI from "../../../../api/comment";
import Icon from "../../../../icons";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { PaperRecord } from "../../../../model/paper";
import { CurrentUserRecord } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import EnvChecker from "../../../../helpers/envChecker";
import { ICommentRecord } from "../../../../model/comment";
import alertToast from "../../../../helpers/makePlutoToastAction";
const styles = require("./searchItem.scss");

export interface SearchItemProps {
  paper: PaperRecord;
  searchQueryText: string;
  isBookmarked: boolean;
  currentUser: CurrentUserRecord;
  withComments: boolean;
  toggleCitationDialog: () => void;
  handlePostBookmark: (paper: PaperRecord) => void;
  handleRemoveBookmark: (paper: PaperRecord) => void;
  isLoading?: boolean;
  handlePostComment?: () => void;
  setActiveCitationDialog?: (paperId: number) => void;
  deleteComment?: (commentId: number) => void;
}

interface SearchItemStates {
  isCommentsOpen: boolean;
  isFetchingComments: boolean;
  comments: List<ICommentRecord>;
  commentTotalPage: number;
  currentCommentPage: number;
}

interface HandleClickClaim {
  paperId: number;
  cognitiveId?: number;
}

export const MINIMUM_SHOWING_COMMENT_NUMBER = 2;

function handleClickClaim({ paperId, cognitiveId }: HandleClickClaim) {
  const targetId = cognitiveId ? `c_${cognitiveId}` : paperId;

  if (!EnvChecker.isServer()) {
    window.open(
      // tslint:disable-next-line:max-line-length
      `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${targetId}&entry.1298741478`,
      "_blank",
    );
  }
}

class SearchItem extends React.PureComponent<SearchItemProps, SearchItemStates> {
  public constructor(props: SearchItemProps) {
    super(props);

    this.state = {
      isCommentsOpen: false,
      isFetchingComments: false,
      comments: List(),
      commentTotalPage: 0,
      currentCommentPage: 1,
    };
  }

  public render() {
    const {
      handlePostComment,
      isLoading,
      searchQueryText,
      currentUser,
      deleteComment,
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
    const { isFetchingComments, commentTotalPage, currentCommentPage } = this.state;

    let source;
    if (!!doi) {
      source = `https://dx.doi.org/${doi}`;
    } else if (urls.size > 0) {
      source = urls.getIn([0, "url"]);
    }

    const commentListToShow = this.state.comments.size === 0 ? comments : this.state.comments;
    const commentPageIsEndToLoad =
      commentTotalPage === 0 ? commentCount <= 10 : commentTotalPage === currentCommentPage;

    let commentNode = null;
    if (withComments) {
      commentNode = (
        <div>
          <CommentInput
            isLoading={isLoading}
            checkAuthDialog={checkAuthDialog}
            handlePostComment={handlePostComment}
            commentCount={commentCount}
            isCommentsOpen={this.state.isCommentsOpen}
            handleClickCommentCount={this.handleClickCommentCount}
          />
          <Comments
            currentUser={currentUser}
            comments={commentListToShow}
            deleteComment={deleteComment}
            isEnd={commentPageIsEndToLoad}
            getMoreComments={this.getMoreComments}
            isFetchingComments={isFetchingComments}
            isCommentsOpen={this.state.isCommentsOpen}
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

  private getMoreComments = async () => {
    const { paper } = this.props;
    const { currentCommentPage } = this.state;

    this.setState({
      isFetchingComments: true,
    });

    try {
      const res = await CommentAPI.getComments({
        page: currentCommentPage + 1,
        paperId: paper.id,
      });

      this.setState({
        comments: this.makeNewCommentList(res.comments),
        currentCommentPage: res.number,
        commentTotalPage: res.totalPages,
      });
    } catch (_err) {
      alertToast({
        type: "error",
        message: `Failed To get more comments.`,
      });
    } finally {
      this.setState({
        isFetchingComments: false,
      });
    }
  };

  private makeNewCommentList = (newComments: List<ICommentRecord>) => {
    const { paper } = this.props;
    const { comments } = this.state;

    if (comments.size === 0) {
      return paper.comments.concat(newComments).toList();
    } else {
      return this.state.comments.concat(newComments).toList();
    }
  };

  private handleClickCommentCount = () => {
    const { paper } = this.props;

    if (paper.commentCount > MINIMUM_SHOWING_COMMENT_NUMBER) {
      this.setState({
        isCommentsOpen: !this.state.isCommentsOpen,
      });
    }
  };
}

export default withStyles<typeof SearchItem>(styles)(SearchItem);
