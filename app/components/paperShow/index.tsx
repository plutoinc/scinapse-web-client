import * as React from "react";
import { parse } from "qs";
import { Link, withRouter, Route, RouteProps, Switch, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as classNames from "classnames";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import { LoadDataParams } from "../../routes";
import { Helmet } from "react-helmet";
import {
  getPaper,
  clearPaperShowState,
  getComments,
  changeCommentInput,
  postComment,
  getReferencePapers,
  toggleAbstract,
  toggleAuthors,
  visitTitle,
  closeFirstOpen,
  getCitedPapers,
} from "./actions";
import { PaperShowStateRecord } from "./records";
import PostAuthor from "./components/author";
import AxiosCancelTokenManager from "../../helpers/axiosCancelTokenManager";
import PaperShowComments from "./components/comments";
import PaperShowKeyword from "./components/keyword";
import DOIButton from "../articleSearch/components/searchItem/dotButton";
import { IPaperSourceRecord } from "../../model/paperSource";
import Icon from "../../icons";
import { CancelTokenSource } from "axios";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import { trackModalView } from "../../helpers/handleGA";
import RelatedPapers from "./components/relatedPapers";
import EnvChecker from "../../helpers/envChecker";
import { push } from "react-router-redux";
import { Footer } from "../layouts";
const styles = require("./paperShow.scss");

const PAPER_SHOW_COMMENTS_PER_PAGE_COUNT = 10;

function mapStateToProps(state: AppState) {
  return {
    routing: state.routing,
    currentUser: state.currentUser,
    paperShow: state.paperShow,
  };
}

export async function getPaperData({ dispatch, match, queryParams }: LoadDataParams) {
  const paperId = parseInt(match.params.paperId, 10);

  await dispatch(
    getPaper({
      paperId,
      cognitiveId: queryParams ? queryParams.cognitiveId : null,
    }),
  );
}

export interface PaperShowMappedState {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
}

export interface PaperShowProps extends DispatchProp<PaperShowMappedState>, RouteComponentProps<{ paperId: string }> {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, {}> {
  private cancelTokenSource: CancelTokenSource = this.getAxiosCancelToken();
  private routeWrapperContainer: HTMLDivElement;

  public componentDidMount() {
    const { paperShow, dispatch, match } = this.props;

    if (!paperShow.paper || paperShow.paper.isEmpty()) {
      getPaperData({
        dispatch,
        match,
        queryParams: this.getQueryParamsObject(),
      });
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(clearPaperShowState());
  }

  public render() {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (!paper || paper.isEmpty()) {
      return null;
    }

    return (
      <div className={styles.paperShowWrapper}>
        {this.getPageHelmet()}
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            {this.getLeftBox()}
            <div className={styles.rightBox}>
              {this.getSourceButton()}
              {this.getPDFDownloadButton()}
              {this.getCommentButton()}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  private getLeftBox = () => {
    const { paperShow, match, currentUser, location } = this.props;
    const { paper } = paperShow;

    return (
      <div className={styles.leftBox}>
        <h1 className={styles.title}>{paper.title}</h1>
        {this.getAuthors()}
        {this.getJournalInformationNode()}
        {this.getDOIButton()}
        <div className={styles.separateLine} />
        {this.getAbstract()}
        {this.getKeywordNode()}
        {this.getTabs()}
        <div className={styles.routesContainer} ref={el => (this.routeWrapperContainer = el)}>
          <Switch>
            <Route
              path={`${match.url}/`}
              render={() => {
                return (
                  <PaperShowComments
                    commentsCount={paper.commentCount}
                    isFetchingComments={paperShow.isLoadingComments}
                    commentInput={paperShow.commentInput}
                    currentCommentPage={paperShow.currentCommentPage}
                    commentTotalPage={paperShow.commentTotalPage}
                    isPostingComment={paperShow.isPostingComment}
                    isFailedToPostingComment={paperShow.isFailedToPostingComment}
                    handlePostComment={this.handlePostComment}
                    handleChangeCommentInput={this.handleChangeCommentInput}
                    fetchComments={this.fetchComments}
                    comments={paperShow.comments}
                  />
                );
              }}
              exact={true}
            />
            <Route
              path={`${match.url}/ref`}
              render={() => {
                return (
                  <div>
                    <div className={styles.relatedTitle}>
                      <span>References</span>
                      <span className={styles.relatedCount}>{paper.referenceCount}</span>
                    </div>
                    <RelatedPapers
                      currentUser={currentUser}
                      paperShow={paperShow}
                      fetchRelatedPapers={this.fetchReferencePapers}
                      toggleAbstract={this.toggleAbstract}
                      toggleAuthors={this.toggleAuthors}
                      closeFirstOpen={this.closeFirstOpen}
                      visitTitle={this.visitTitle}
                      location={location}
                    />
                  </div>
                );
              }}
            />
            <Route
              path={`${match.url}/cited`}
              render={() => {
                return (
                  <div>
                    <div className={styles.relatedTitle}>
                      <span>Cited by</span>
                      <span className={styles.relatedCount}>{paper.citedCount}</span>
                    </div>
                    <RelatedPapers
                      currentUser={currentUser}
                      paperShow={paperShow}
                      fetchRelatedPapers={this.fetchCitedPapers}
                      toggleAbstract={this.toggleAbstract}
                      toggleAuthors={this.toggleAuthors}
                      closeFirstOpen={this.closeFirstOpen}
                      visitTitle={this.visitTitle}
                      location={location}
                    />
                  </div>
                );
              }}
            />
          </Switch>
        </div>
      </div>
    );
  };

  private getSourceButton = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    const source = paper.doi ? `https://dx.doi.org/${paper.doi}` : paper.urls.getIn([0, "url"]);

    if (source) {
      return (
        <a className={styles.pdfButtonWrapper} href={source} target="_blank">
          <Icon className={styles.sourceIcon} icon="SOURCE_LINK" />
          <span>View in source</span>
        </a>
      );
    } else {
      return null;
    }
  };

  private getDOIButton = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (paper.doi) {
      return (
        <DOIButton
          style={{
            display: "inline-block",
            verticalAlign: "top",
            lineHeight: "1.3",
            borderRadius: "5px",
            border: "solid 1px #e7eaf2",
            fontSize: "15px",
          }}
          DOI={paper.doi}
        />
      );
    } else {
      return null;
    }
  };

  private toggleAuthors = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(toggleAuthors(paperId));
  };

  private toggleAbstract = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(toggleAbstract(paperId));
  };

  private visitTitle = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(visitTitle(paperId));
  };

  private handleClickLeaveCommentButton = () => {
    const { dispatch, location, match } = this.props;
    if (!EnvChecker.isServer()) {
      if (location.pathname !== match.url) {
        dispatch(push(match.url));
      }
      const targetTopScrollHeight = this.routeWrapperContainer.getBoundingClientRect().top;
      window.scrollTo(0, targetTopScrollHeight);
    }
  };

  private closeFirstOpen = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(closeFirstOpen(paperId));
  };

  private getTabs = () => {
    const { paperShow, match, location } = this.props;
    const { paper } = paperShow;

    return (
      <div className={styles.tabWrapper}>
        <Link
          to={location.search ? `${match.url}${location.search}` : `${match.url}`}
          className={classNames({
            [`${styles.tabButton}`]: true,
            [`${styles.activeTab}`]: location.pathname === match.url,
          })}
        >
          {`Comments (${paper.commentCount})`}
        </Link>
        <Link
          to={location.search ? `${match.url}/ref${location.search}` : `${match.url}/ref`}
          className={classNames({
            [`${styles.tabButton}`]: true,
            [`${styles.activeTab}`]: location.pathname.search(/\/ref$/) > 0,
          })}
        >
          {`References (${paper.referenceCount})`}
        </Link>
        <Link
          to={location.search ? `${match.url}/cited${location.search}` : `${match.url}/cited`}
          className={classNames({
            [`${styles.tabButton}`]: true,
            [`${styles.activeTab}`]: location.pathname.search(/\/cited$/) > 0,
          })}
        >
          {`Cited by (${paper.citedCount})`}
        </Link>
      </div>
    );
  };

  private fetchCitedPapers = (page = 0) => {
    const { dispatch, paperShow } = this.props;
    const cancelTokenSource = this.getAxiosCancelToken();

    dispatch(
      getCitedPapers({
        paperId: paperShow.paper.id,
        page,
        filter: "year=:,if=:",
        cancelTokenSource,
        cognitiveId: null,
      }),
    );
  };

  private fetchReferencePapers = (page = 0) => {
    const { dispatch, paperShow } = this.props;
    const cancelTokenSource = this.getAxiosCancelToken();

    dispatch(
      getReferencePapers({
        paperId: paperShow.paper.id,
        page,
        filter: "year=:,if=:",
        cancelTokenSource,
        cognitiveId: null,
      }),
    );
  };

  private getCommentButton = () => {
    return (
      <a onClick={this.handleClickLeaveCommentButton} className={styles.commentButton}>
        Leave a comment
      </a>
    );
  };

  private getPDFDownloadButton = () => {
    const { paperShow } = this.props;

    const pdfSourceRecord = paperShow.paper.urls.find((paperSource: IPaperSourceRecord) => {
      return paperSource.url.includes(".pdf");
    });

    if (pdfSourceRecord) {
      return (
        <a className={styles.pdfButtonWrapper} href={pdfSourceRecord.url} target="_blank">
          <Icon className={styles.pdfIconWrapper} icon="PDF_ICON" />
          <span>View PDF</span>
        </a>
      );
    } else {
      return null;
    }
  };

  private getKeywordNode = () => {
    const { paperShow } = this.props;

    if (!paperShow.paper.fosList || paperShow.paper.fosList.isEmpty()) {
      return null;
    } else {
      const keywordNodes = paperShow.paper.fosList.map((fos, index) => {
        return <PaperShowKeyword fos={fos} key={`${fos.fos}_${index}}`} />;
      });

      return (
        <div className={styles.keywordBox}>
          <div className={styles.keywordTitle}>Keyword</div>
          {keywordNodes}
        </div>
      );
    }
  };

  private getAbstract = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    return (
      <div className={styles.abstractBox}>
        <div className={styles.abstractTitle}>Abstract</div>
        <div className={styles.abstractContent}>{paper.abstract}</div>
      </div>
    );
  };

  private getAuthors = () => {
    const { paperShow } = this.props;

    const authors = paperShow.paper.authors.map((author, index) => {
      return <PostAuthor author={author} key={`${paperShow.paper.title}_${author.name}_${index}`} />;
    });

    return (
      <div className={styles.authorBox}>
        <span className={styles.subInformationIconWrapper}>
          <Icon className={styles.subInformationIcon} icon="AUTHOR" />
        </span>
        {authors}
      </div>
    );
  };

  private getPageHelmet = () => {
    const { paperShow } = this.props;
    return (
      <Helmet>
        <title>{paperShow.paper.title} | Pluto Beta | Academic discovery</title>
      </Helmet>
    );
  };

  private getJournalInformationNode = () => {
    const { paperShow } = this.props;
    const { journal } = paperShow.paper;

    if (!journal) {
      return null;
    } else {
      return (
        <div className={styles.journalInformation}>
          <span className={styles.subInformationIconWrapper}>
            <Icon className={styles.subInformationIcon} icon="JOURNAL" />
          </span>
          {`Published ${paperShow.paper.year} in ${journal.fullTitle || paperShow.paper.venue}`}
          <span>{journal.impactFactor ? ` [IF: ${journal.impactFactor}]` : ""}</span>
        </div>
      );
    }
  };

  private handleChangeCommentInput = (comment: string) => {
    const { dispatch } = this.props;

    dispatch(changeCommentInput(comment));
  };

  private handlePostComment = () => {
    const { dispatch, paperShow, currentUser } = this.props;
    const trimmedComment = paperShow.commentInput.trim();

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      const hasRightToPostComment = currentUser.oauthLoggedIn || currentUser.emailVerified;

      if (!hasRightToPostComment) {
        dispatch(openVerificationNeeded());
        trackModalView("postCommentVerificationNeededOpen");
      } else if (trimmedComment.length > 0) {
        dispatch(
          postComment({
            paperId: paperShow.paper.id,
            cognitivePaperId: paperShow.paper.cognitivePaperId,
            comment: trimmedComment,
          }),
        );
      }
    }
  };

  private fetchComments = (pageIndex: number = 0) => {
    const { paperShow, dispatch } = this.props;
    const { paper } = paperShow;

    if (!paper) {
      return;
    }

    const paperId = paper.cognitivePaperId ? paper.cognitivePaperId : paper.id;

    dispatch(
      getComments({
        paperId,
        page: pageIndex,
        size: PAPER_SHOW_COMMENTS_PER_PAGE_COUNT,
        cancelTokenSource: this.cancelTokenSource,
        cognitive: !!paper.cognitivePaperId,
      }),
    );
  };

  private getQueryParamsObject() {
    const { routing } = this.props;
    return parse(routing.location.search, { ignoreQueryPrefix: true });
  }

  private getAxiosCancelToken() {
    const axiosCancelTokenManager = new AxiosCancelTokenManager();
    return axiosCancelTokenManager.getCancelTokenSource();
  }
}

export default connect(mapStateToProps)(withRouter(PaperShow));
