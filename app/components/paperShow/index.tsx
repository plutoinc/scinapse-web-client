import * as React from "react";
import { parse } from "qs";
import { Link, withRouter, Route, RouteProps, Switch, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as classNames from "classnames";
import { Helmet } from "react-helmet";
import { push } from "react-router-redux";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import { LoadDataParams } from "../../routes";
import ArticleSpinner from "../common/spinner/articleSpinner";
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
  deleteComment,
  handleClickCitationTab,
  getCitationText,
  toggleCitationDialog,
  getBookmarkedStatus,
} from "./actions";
import { PaperShowStateRecord, AvailableCitationType } from "./records";
import CitationBox from "./components/citationBox";
import PostAuthor from "./components/author";
import PaperShowComments from "./components/comments";
import PaperShowKeyword from "./components/keyword";
import DOIButton from "../articleSearch/components/searchItem/dotButton";
import { IPaperSourceRecord } from "../../model/paperSource";
import Icon from "../../icons";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import { trackModalView } from "../../helpers/handleGA";
import RelatedPapers from "./components/relatedPapers";
import EnvChecker from "../../helpers/envChecker";
import { Footer } from "../layouts";
import { ICommentRecord } from "../../model/comment";
import CitationDialog from "../common/citationDialog";
import { ConfigurationRecord } from "../../reducers/configuration";
import { postBookmark, removeBookmark, getBookmarkedStatus as getBookmarkedStatusList } from "../../actions/bookmark";
import { PaperRecord } from "../../model/paper";
const styles = require("./paperShow.scss");

const PAPER_SHOW_COMMENTS_PER_PAGE_COUNT = 10;

export interface GetPaginationDataParams extends LoadDataParams {
  paperId?: number;
  page?: number;
}

function mapStateToProps(state: AppState) {
  return {
    routing: state.routing,
    currentUser: state.currentUser,
    paperShow: state.paperShow,
    configuration: state.configuration,
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

export async function getCommentsData({ dispatch, match, paperId, page = 0 }: GetPaginationDataParams) {
  const targetPaperId = paperId ? paperId : parseInt(match.params.paperId, 10);

  await dispatch(
    getComments({
      paperId: targetPaperId,
      size: PAPER_SHOW_COMMENTS_PER_PAGE_COUNT,
      page,
    }),
  );
}

export async function getReferencePapersData({
  dispatch,
  match,
  paperId,
  page = 0,
  pathname,
}: GetPaginationDataParams) {
  const targetPaperId = paperId ? paperId : parseInt(match.params.paperId, 10);
  if (pathname && !pathname.includes("/cited")) {
    const papers = await dispatch(
      getReferencePapers({
        paperId: targetPaperId,
        page,
        filter: "year=:,if=:",
        cognitiveId: null,
      }),
    );
    return papers;
  }
}

export async function getCitedPapersData({ dispatch, match, paperId, page = 0, pathname }: GetPaginationDataParams) {
  const targetPaperId = paperId ? paperId : parseInt(match.params.paperId, 10);
  if (pathname && pathname.includes("/cited")) {
    const papers = await dispatch(
      getCitedPapers({
        paperId: targetPaperId,
        page,
        filter: "year=:,if=:",
        cognitiveId: null,
      }),
    );

    return papers;
  }
}

export interface PaperShowMappedState {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
  configuration: ConfigurationRecord;
}

export interface PaperShowProps extends DispatchProp<PaperShowMappedState>, RouteComponentProps<{ paperId: string }> {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
  configuration: ConfigurationRecord;
}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, {}> {
  private routeWrapperContainer: HTMLDivElement;
  private commentElement: HTMLDivElement;

  public componentDidMount() {
    const { configuration } = this.props;
    const notRenderedAtServer = !configuration.initialFetched || configuration.clientJSRendered;

    if (notRenderedAtServer) {
      this.fetchPaperData();
    }

    this.fetchCitationText();
    this.checkRelatedPapersBookmarkedStatus();
    this.getCurrentPaperBookmarkedStatus();
  }

  public componentDidUpdate(prevProps: PaperShowProps) {
    const authStatusChanged = prevProps.currentUser.isLoggedIn !== this.props.currentUser.isLoggedIn;

    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.fetchPaperData();
    }

    if ((!prevProps.paperShow.paper && this.props.paperShow.paper) || authStatusChanged) {
      this.fetchMetadata();
      this.scrollToRelatedPapersNode();
      this.getCurrentPaperBookmarkedStatus();
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(clearPaperShowState());
  }

  public render() {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (paperShow.isLoadingPaper) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    }

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
              {this.getBookmarkButton()}
              {this.getCitationBox()}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  private fetchPaperData = () => {
    const { dispatch, match } = this.props;

    getPaperData({
      dispatch,
      match,
      queryParams: this.getQueryParamsObject(),
    });
  };

  private fetchMetadata = () => {
    this.fetchComments(0);
    this.fetchRelatedPapers();
    this.fetchCitationText();
  };

  private fetchCitationText = () => {
    const { dispatch, paperShow } = this.props;

    if (paperShow.paper && paperShow.paper.doi) {
      dispatch(getCitationText({ type: AvailableCitationType.BIBTEX, paperId: paperShow.paper.id }));
    }
  };

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
        <div ref={el => (this.commentElement = el)}>
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
            currentUser={currentUser}
            handleDeleteComment={this.handleDeleteComment}
          />
        </div>
        {this.getTabs()}
        <div className={styles.routesContainer} ref={el => (this.routeWrapperContainer = el)}>
          <Switch>
            <Route
              path={`${match.url}/`}
              render={() => {
                return (
                  <div>
                    <div className={styles.relatedTitle}>
                      <span>References</span>
                      <span className={styles.relatedCount}>{paper.referenceCount}</span>
                    </div>
                    <RelatedPapers
                      handleRemoveBookmark={this.handleRemoveBookmark}
                      handlePostBookmark={this.handlePostBookmark}
                      currentUser={currentUser}
                      paperShow={paperShow}
                      toggleCitationDialog={this.toggleCitationDialog}
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
                      handleRemoveBookmark={this.handleRemoveBookmark}
                      handlePostBookmark={this.handlePostBookmark}
                      toggleCitationDialog={this.toggleCitationDialog}
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
                      handleRemoveBookmark={this.handleRemoveBookmark}
                      handlePostBookmark={this.handlePostBookmark}
                      toggleCitationDialog={this.toggleCitationDialog}
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

  private toggleCitationDialog = () => {
    const { dispatch } = this.props;

    dispatch(toggleCitationDialog());
  };

  private getCurrentPaperBookmarkedStatus = () => {
    const { dispatch, paperShow, currentUser } = this.props;

    if (paperShow.paper && currentUser.isLoggedIn) {
      dispatch(getBookmarkedStatus(paperShow.paper));
    }
  };

  private getBookmarkButton = () => {
    const { paperShow } = this.props;

    if (paperShow.isBookmarked) {
      return (
        <a
          onClick={() => {
            this.handleRemoveBookmark(paperShow.paper);
          }}
          className={styles.activeBookmarkButton}
        >
          <Icon icon="BOOKMARK_GRAY" className={styles.bookmarkButtonIcon} />
          <span>Bookmarked</span>
        </a>
      );
    } else {
      return (
        <a
          onClick={() => {
            this.handlePostBookmark(paperShow.paper);
          }}
          className={styles.bookmarkButton}
        >
          <Icon icon="BOOKMARK_GRAY" className={styles.bookmarkButtonIcon} />
          <span>Bookmark</span>
        </a>
      );
    }
  };

  private scrollToRelatedPapersNode = () => {
    if (
      (!EnvChecker.isServer() && location.pathname.search(/\/ref$/) > 0) ||
      location.pathname.search(/\/cited$/) > 0
    ) {
      const targetTopScrollHeight = this.routeWrapperContainer && this.routeWrapperContainer.offsetTop;
      window.scrollTo(0, targetTopScrollHeight);
    }
  };

  private handlePostBookmark = (paper: PaperRecord) => {
    const { dispatch, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      dispatch(postBookmark(paper));
    }
  };

  private handleRemoveBookmark = (paper: PaperRecord) => {
    const { dispatch, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      dispatch(removeBookmark(paper));
    }
  };

  private getCitationBox = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (paper.doi) {
      return (
        <div>
          <CitationBox
            paperId={paper.id}
            toggleCitationDialog={this.toggleCitationDialog}
            handleClickCitationTab={this.handleClickCitationTab}
            activeTab={paperShow.activeCitationTab}
            isLoading={paperShow.isFetchingCitationInformation}
            citationText={paperShow.citationText}
            isFullFeature={false}
          />
          <CitationDialog
            paperId={paper.id}
            isOpen={paperShow.isCitationDialogOpen}
            toggleCitationDialog={this.toggleCitationDialog}
            isFullFeature={true}
            handleClickCitationTab={this.handleClickCitationTab}
            activeTab={paperShow.activeCitationTab}
            isLoading={paperShow.isFetchingCitationInformation}
            citationText={paperShow.citationText}
          />
        </div>
      );
    } else {
      return null;
    }
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

  private handleClickCitationTab = (tab: AvailableCitationType) => {
    const { dispatch, paperShow } = this.props;

    dispatch(handleClickCitationTab(tab));
    dispatch(getCitationText({ type: tab, paperId: paperShow.paper.id }));
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
      const targetTopScrollHeight = this.commentElement && this.commentElement.offsetTop;
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
          onClick={() => {
            this.fetchReferencePapers(0);
          }}
          to={location.search ? `${match.url}${location.search}` : `${match.url}`}
          className={classNames({
            [`${styles.tabButton}`]: true,
            [`${styles.activeTab}`]: location.pathname === match.url || location.pathname.search(/\/ref$/) > 0,
          })}
        >
          {`References (${paper.referenceCount})`}
        </Link>
        <Link
          onClick={() => {
            this.fetchCitedPapers(0);
          }}
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

  private fetchCitedPapers = async (page = 0) => {
    const { match, dispatch, paperShow } = this.props;

    const papers = await getCitedPapersData({
      dispatch,
      paperId: paperShow.paper.id,
      page,
      match,
      pathname: location.pathname,
    });
    return papers;
  };

  private fetchReferencePapers = async (page = 0) => {
    const { dispatch, paperShow, match } = this.props;

    const papers = await getReferencePapersData({
      dispatch,
      paperId: paperShow.paper.id,
      page,
      match,
      pathname: location.pathname,
    });
    return papers;
  };

  private checkRelatedPapersBookmarkedStatus = () => {
    const { paperShow, currentUser, dispatch } = this.props;
    const { paper } = paperShow;

    if (currentUser.isLoggedIn && paper && paperShow.relatedPapers) {
      dispatch(getBookmarkedStatusList(paperShow.relatedPapers));
    }
  };

  private fetchRelatedPapers = async () => {
    const { location, dispatch, currentUser } = this.props;

    let papers;
    if (location.pathname.includes("/cited")) {
      papers = await this.fetchCitedPapers();
    } else {
      papers = await this.fetchReferencePapers();
    }

    if (currentUser.isLoggedIn) {
      await dispatch(getBookmarkedStatusList(papers));
    }
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

  private buildPageDescription = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    const shortAbstract = paper.abstract ? `${paper.abstract.slice(0, 50)} | ` : "";
    const shortAuthors =
      paper.authors && !paper.authors.isEmpty()
        ? `${paper.authors
            .map(author => author.name)
            .join(", ")
            .slice(0, 50)}  | `
        : "";
    const shortJournals = paper.journal && !paper.journal.isEmpty ? `${paper.journal.fullTitle.slice(0, 50)} | ` : "";

    return `${shortAbstract}${shortAuthors}${shortJournals} | Sci-napse`;
  };

  private makeStructuredData = (paper: PaperRecord) => {
    const authorsForStructuredData = paper.authors.map(author => {
      return {
        "@type": "Person",
        name: author.name,
        affiliation: {
          name: author.organization,
        },
      };
    });

    const structuredData: any = {
      "@context": "http://schema.org",
      "@type": "Article",
      headline: paper.title,
      image: [],
      datePublished: paper.year,
      author: authorsForStructuredData,
      keywords: paper.fosList.map(fos => fos.fos),
      publisher: {
        "@type": "Organization",
        name: paper.publisher,
      },
      description: paper.abstract,
      mainEntityOfPage: "https://scinapse.io",
    };

    return structuredData;
  };

  private getPageHelmet = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    return (
      <Helmet>
        <title>{paper.title} | Sci-napse | Academic search engine for paper</title>
        <meta name="description" content={this.buildPageDescription()} />
        <meta itemProp="description" content={this.buildPageDescription()} />
        <meta name="twitter:description" content={this.buildPageDescription()} />
        <script type="application/ld+json">{JSON.stringify(this.makeStructuredData(paper))}</script>
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

  private handleDeleteComment = (comment: ICommentRecord) => {
    const { dispatch, paperShow, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      const hasRightToDeleteComment =
        (currentUser.oauthLoggedIn || currentUser.emailVerified) && comment.createdBy.id === currentUser.id;

      if (!hasRightToDeleteComment) {
        dispatch(openVerificationNeeded());
        trackModalView("deleteCommentVerificationNeededOpen");
      } else {
        dispatch(
          deleteComment({
            paperId: paperShow.paper.id,
            commentId: comment.id,
          }),
        );
      }
    }
  };

  private fetchComments = (pageIndex: number = 0) => {
    const { dispatch, match } = this.props;

    getCommentsData({ page: pageIndex, match, dispatch });
  };

  private getQueryParamsObject() {
    const { routing } = this.props;
    return parse(routing.location.search, { ignoreQueryPrefix: true });
  }
}

export default connect(mapStateToProps)(withRouter(PaperShow));
