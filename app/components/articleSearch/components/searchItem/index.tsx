import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
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
import { Paper } from "../../../../model/paper";
import { CurrentUser } from "../../../../model/currentUser";
import { withStyles } from "../../../../helpers/withStylesHelper";
import EnvChecker from "../../../../helpers/envChecker";
import { Comment } from "../../../../model/comment";
import alertToast from "../../../../helpers/makePlutoToastAction";
const styles = require("./searchItem.scss");

interface HandleClickClaim {
  paperId: number;
  cognitiveId?: number;
}

export interface SearchItemProps {
  paper: Paper;
  searchQueryText: string;
  isBookmarked: boolean;
  currentUser: CurrentUser;
  withComments: boolean;
  toggleCitationDialog: () => void;
  handlePostBookmark: (paper: Paper) => void;
  handleRemoveBookmark: (paper: Paper) => void;
  setActiveCitationDialog?: (paperId: number) => void;
  deleteComment?: (commentId: number) => void;
  checkVerifiedUser?: () => boolean;
}

interface SearchItemStates
  extends Readonly<{
      isAdditionalMenuOpen: boolean;
      isCommentsOpen: boolean;
      isFetchingComments: boolean;
      comments: Comment[];
      commentCount: number;
      commentTotalPage: number;
      currentCommentPage: number;
    }> {}

export const MINIMUM_SHOWING_COMMENT_NUMBER = 2;

class SearchItem extends React.PureComponent<
  SearchItemProps,
  SearchItemStates
> {
  private additionalMenuAchorEl: HTMLElement | null;

  public constructor(props: SearchItemProps) {
    super(props);

    this.state = {
      isAdditionalMenuOpen: false,
      isCommentsOpen: false,
      isFetchingComments: false,
      comments: props.paper.comments,
      commentCount: props.paper.commentCount,
      commentTotalPage: 0,
      currentCommentPage: 1
    };
  }

  public render() {
    const {
      searchQueryText,
      currentUser,
      paper,
      withComments,
      toggleCitationDialog,
      setActiveCitationDialog,
      handlePostBookmark,
      isBookmarked,
      handleRemoveBookmark,
      checkVerifiedUser
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
      urls,
      journal,
      cognitivePaperId
    } = paper;
    const {
      comments,
      isFetchingComments,
      commentCount,
      isAdditionalMenuOpen
    } = this.state;

    let source: string;
    if (!!doi) {
      source = `https://dx.doi.org/${doi}`;
    } else if (urls && urls.length > 0) {
      source = urls[0].url;
    } else {
      source = "";
    }

    const commentPageIsEndToLoad = comments.length === commentCount;

    let commentNode = null;
    if (withComments && checkVerifiedUser) {
      commentNode = (
        <div>
          <CommentInput
            paperId={paper.id}
            checkAuthDialog={checkAuthDialog}
            checkVerifiedUser={checkVerifiedUser}
            commentCount={commentCount}
            isCommentsOpen={this.state.isCommentsOpen}
            handleAddingNewComment={this.handleAddingNewComment}
            handleClickCommentCount={this.handleClickCommentCount}
          />
          <Comments
            currentUser={currentUser}
            comments={comments}
            isEnd={commentPageIsEndToLoad}
            getMoreComments={this.getMoreComments}
            isFetchingComments={isFetchingComments}
            isCommentsOpen={this.state.isCommentsOpen}
            handleRemoveComment={this.handleRemoveComment}
          />
        </div>
      );
    }

    return (
      <div className={styles.searchItemWrapper}>
        <div className={styles.claimButton}>
          <div
            className={styles.claimButtonHiddenLayer}
            ref={el => (this.additionalMenuAchorEl = el)}
          >
            <IconButton
              onClick={this.openAdditionalMenu}
              classes={{ root: styles.additionalMenuIcon }}
            >
              <Icon className={styles.ellipsisIcon} icon="ELLIPSIS" />
            </IconButton>
          </div>
          <Menu
            anchorEl={this.additionalMenuAchorEl!}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={isAdditionalMenuOpen}
            onClose={this.closeAdditionalMenu}
          >
            <MenuItem
              style={{
                color: "#f54b5e"
              }}
              onClick={() => {
                this.handleClickClaim({
                  paperId: id,
                  cognitiveId: cognitivePaperId
                });
                this.closeAdditionalMenu();
              }}
            >
              Claim
            </MenuItem>
          </Menu>
        </div>
        <div className={styles.contentSection}>
          <div className={styles.titleWrapper}>
            <Title
              title={title}
              paperId={paper.id}
              searchQueryText={searchQueryText}
              source={source}
            />
          </div>
          <PublishInfoList
            journalName={journal ? journal.fullTitle! : venue}
            journalIF={journal ? journal.impactFactor || 0 : 0}
            year={year}
            authors={authors}
          />
          <Abstract abstract={abstract} searchQueryText={searchQueryText} />
          <Keywords keywords={fosList} />
          <InfoList
            handleRemoveBookmark={handleRemoveBookmark}
            handlePostBookmark={handlePostBookmark}
            currentUser={currentUser}
            isBookmarked={isBookmarked}
            setActiveCitationDialog={setActiveCitationDialog}
            toggleCitationDialog={toggleCitationDialog}
            paper={paper}
          />
          {commentNode}
        </div>
      </div>
    );
  }

  private openAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: true
    });
  };

  private closeAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: false
    });
  };

  private handleAddingNewComment = (newComment: Comment) => {
    this.setState({
      comments: [...[newComment], ...this.state.comments],
      commentCount: this.state.commentCount + 1
    });
  };

  private handleRemoveComment = async (targetComment: Comment) => {
    const { paper } = this.props;
    const { comments } = this.state;

    try {
      await CommentAPI.deleteComment({
        paperId: paper.id,
        commentId: targetComment.id
      });

      const index = comments.findIndex(
        comment => comment!.id === targetComment.id
      );
      if (index > -1) {
        const newCommentList = [
          ...comments.slice(0, index),
          ...comments.slice(index + 1)
        ];

        this.setState({
          comments: newCommentList
        });
      }
    } catch (_err) {
      alertToast({
        type: "error",
        message: `Failed to remove the comment.`
      });
    }
  };

  private getMoreComments = async () => {
    const { paper } = this.props;
    const { currentCommentPage } = this.state;

    try {
      this.setState({
        isFetchingComments: true
      });

      const res = await CommentAPI.getRawComments({
        page: currentCommentPage + 1,
        paperId: paper.id
      });

      this.setState({
        comments: [...this.state.comments, ...res.content],
        currentCommentPage: res.number,
        commentTotalPage: res.totalPages,
        commentCount: res.totalElements
      });
    } catch (_err) {
      alertToast({
        type: "error",
        message: `Failed To get more comments.`
      });
    } finally {
      this.setState({
        isFetchingComments: false
      });
    }
  };

  private handleClickCommentCount = () => {
    const { paper } = this.props;

    if (paper.commentCount > MINIMUM_SHOWING_COMMENT_NUMBER) {
      this.setState({
        isCommentsOpen: !this.state.isCommentsOpen
      });
    }
  };

  private handleClickClaim = ({ paperId, cognitiveId }: HandleClickClaim) => {
    const targetId = cognitiveId ? `c_${cognitiveId}` : paperId;

    if (!EnvChecker.isServer()) {
      window.open(
        // tslint:disable-next-line:max-line-length
        `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${targetId}&entry.1298741478`,
        "_blank"
      );
    }
  };
}

export default withStyles<typeof SearchItem>(styles)(SearchItem);
