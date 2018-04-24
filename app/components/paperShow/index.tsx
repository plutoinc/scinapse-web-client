import * as React from "react";
import { withRouter, RouteProps, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { Helmet } from "react-helmet";
import { throttle, Cancelable } from "lodash";
import * as classNames from "classnames";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import { LoadDataParams } from "../../routes";
import ArticleSpinner from "../common/spinner/articleSpinner";
import {
  clearPaperShowState,
  changeCommentInput,
  postComment,
  toggleAbstract,
  toggleAuthors,
  visitTitle,
  closeFirstOpen,
  deleteComment,
  handleClickCitationTab,
  getCitationText,
  toggleCitationDialog,
  getBookmarkedStatus,
  getComments,
  getReferencePapers,
  getCitedPapers,
  toggleAuthorBox,
} from "./actions";
import { PaperShowStateRecord, AvailableCitationType } from "./records";
import AuthorList from "./components/authorList";
import PaperShowCommentInput from "./components/commentInput";
import PaperShowBookmarkButton from "./components/bookmarkButton";
import PaperShowComments from "./components/comments";
import FOSList from "./components/fosList";
import { IPaperSourceRecord } from "../../model/paperSource";
import Icon from "../../icons";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import { trackModalView, trackAndOpenLink, trackEvent } from "../../helpers/handleGA";
import RelatedPapers from "./components/relatedPapers";
import EnvChecker from "../../helpers/envChecker";
import { Footer } from "../layouts";
import { ICommentRecord } from "../../model/comment";
import CitationDialog from "../common/citationDialog";
import { ConfigurationRecord } from "../../reducers/configuration";
import { postBookmark, removeBookmark, getBookmarkedStatus as getBookmarkedStatusList } from "../../actions/bookmark";
import { PaperRecord } from "../../model/paper";
import { fetchPaperShowData } from "./sideEffect";
import { RELATED_PAPERS } from "./constants";
import copySelectedTextToClipboard from "../../helpers/copySelectedTextToClipboard";
const styles = require("./paperShow.scss");

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

interface PaperShowStates {
  isOnTheTabWrapper: boolean;
}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, PaperShowStates> {
  private handleScroll: (() => void) & Cancelable;
  private abstractSection: HTMLDivElement;
  private tabWrapper: HTMLDivElement;
  private referencePapersWrapper: HTMLDivElement;
  private citedPapersWrapper: HTMLDivElement;
  private commentElement: HTMLDivElement;

  constructor(props: PaperShowProps) {
    super(props);

    this.handleScroll = throttle(this.handleScrollEvent, 300);
    this.state = {
      isOnTheTabWrapper: true,
    };
  }

  public async componentDidMount() {
    const { configuration, currentUser, dispatch, match, location } = this.props;
    const notRenderedAtServerOrJSAlreadyInitialized = !configuration.initialFetched || configuration.clientJSRendered;

    if (!EnvChecker.isServer()) {
      window.addEventListener("scroll", this.handleScroll);
    }

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      // TODO: Get page from queryParams
      await fetchPaperShowData({ dispatch, match, pathname: location.pathname }, currentUser);
      this.scrollToRelatedPapersNode();
    } else {
      if (currentUser && currentUser.isLoggedIn) {
        this.checkCurrentBookmarkedStatus();
      }
    }
  }

  public async componentDidUpdate(prevProps: PaperShowProps) {
    const { dispatch, match, location, currentUser, paperShow } = this.props;

    const authStatusChanged = prevProps.currentUser.isLoggedIn !== this.props.currentUser.isLoggedIn;
    const movedToDifferentPaper = match.params.paperId !== prevProps.match.params.paperId;
    const movedToDifferentReferencePapersTab =
      !movedToDifferentPaper && prevProps.location.pathname !== this.props.location.pathname;
    const referencePaperPaginationIsChanged =
      paperShow.referencePaperCurrentPage !== prevProps.paperShow.referencePaperCurrentPage;
    const citedPaperPaginationIsChanged = paperShow.citedPaperCurrentPage !== prevProps.paperShow.citedPaperCurrentPage;

    if (this.props.location !== prevProps.location) {
      this.restorationScroll();
    }

    if (movedToDifferentPaper) {
      await fetchPaperShowData({ dispatch, match, pathname: location.pathname }, currentUser);
      this.scrollToRelatedPapersNode();
    } else if (movedToDifferentReferencePapersTab) {
      this.fetchRelatedPapers();
    }

    if (
      currentUser &&
      currentUser.isLoggedIn &&
      (referencePaperPaginationIsChanged || citedPaperPaginationIsChanged || authStatusChanged)
    ) {
      this.checkCurrentBookmarkedStatus();
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    if (!EnvChecker.isServer()) {
      window.removeEventListener("scroll", this.handleScroll);
    }

    dispatch(clearPaperShowState());
  }

  public render() {
    const { paperShow, location, currentUser } = this.props;
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
        <div className={styles.headSection}>
          <div className={styles.container}>
            <div className={styles.innerContainer}>
              <div className={styles.leftBox}>
                <h1 className={styles.title}>{paper.title}</h1>
                {this.getJournalInformationNode()}
                {this.getDOIButton()}
                <div className={styles.authorListBox}>
                  <AuthorList
                    handleToggleAuthorBox={this.handleToggleAuthorBox}
                    isAuthorBoxExtended={paperShow.isAuthorBoxExtended}
                    authors={paper.authors}
                  />
                </div>
              </div>
              <div className={styles.rightBox}>
                {this.getSourceButton()}
                {this.getPDFDownloadButton()}
                {this.getCitationBox()}
                <div className={styles.bookmarkButtonBox}>
                  <PaperShowBookmarkButton toggleBookmark={this.toggleBookmark} isBookmarked={paperShow.isBookmarked} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <div className={styles.contentLeftBox}>
              <div ref={el => (this.abstractSection = el)} className={styles.abstractBox}>
                <div className={styles.abstractTitle}>Abstract</div>
                <div className={styles.abstractContent}>{paper.abstract}</div>
              </div>
              <FOSList FOSList={paper.fosList} />
              <div ref={el => (this.commentElement = el)}>
                <div className={styles.commentsBoxWrapper}>
                  <div className={styles.commentTitle}>
                    <span>Comments</span>
                    <span className={styles.commentCount}>{paper.commentCount}</span>
                  </div>
                  <div className={styles.line} />
                  <PaperShowCommentInput
                    commentInput={paperShow.commentInput}
                    isPostingComment={paperShow.isPostingComment}
                    isFailedToPostingComment={paperShow.isFailedToPostingComment}
                    handlePostComment={this.handlePostComment}
                    handleChangeCommentInput={this.handleChangeCommentInput}
                  />
                  <PaperShowComments
                    isFetchingComments={paperShow.isLoadingComments}
                    currentCommentPage={paperShow.currentCommentPage}
                    commentTotalPage={paperShow.commentTotalPage}
                    fetchComments={this.fetchComments}
                    comments={paperShow.comments}
                    currentUser={currentUser}
                    handleDeleteComment={this.handleDeleteComment}
                  />
                </div>
              </div>
              <div ref={el => (this.tabWrapper = el)}>{this.getTabs()}</div>
              <div
                ref={el => (this.referencePapersWrapper = el)}
                className={`${styles.relatedTitle} ${styles.referencesTitle}`}
              >
                <span>References</span>
                <span className={styles.relatedCount}>{paper.referenceCount}</span>
              </div>
              <RelatedPapers
                type="reference"
                handleRemoveBookmark={this.handleRemoveBookmark}
                handlePostBookmark={this.handlePostBookmark}
                currentUser={currentUser}
                paperShow={paperShow}
                toggleCitationDialog={this.toggleCitationDialog}
                handleClickPagination={this.handleClickReferencePapersPagination}
                toggleAbstract={this.toggleAbstract}
                toggleAuthors={this.toggleAuthors}
                closeFirstOpen={this.closeFirstOpen}
                visitTitle={this.visitTitle}
                location={location}
              />
              <div ref={el => (this.citedPapersWrapper = el)} className={styles.relatedTitle}>
                <span>Cited by</span>
                <span className={styles.relatedCount}>{paper.citedCount}</span>
              </div>
              <RelatedPapers
                type="cited"
                handleRemoveBookmark={this.handleRemoveBookmark}
                handlePostBookmark={this.handlePostBookmark}
                toggleCitationDialog={this.toggleCitationDialog}
                currentUser={currentUser}
                paperShow={paperShow}
                handleClickPagination={this.handleClickCitedPapersPagination}
                toggleAbstract={this.toggleAbstract}
                toggleAuthors={this.toggleAuthors}
                closeFirstOpen={this.closeFirstOpen}
                visitTitle={this.visitTitle}
                location={location}
              />
            </div>
            <div className={styles.rightBox} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  private restorationScroll = () => {
    window.scrollTo(0, 0);
    this.setState({ isOnTheTabWrapper: true });
  };

  private handleScrollEvent = () => {
    const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const targetTop = this.tabWrapper && this.tabWrapper.offsetTop;

    if (top <= targetTop && !this.state.isOnTheTabWrapper) {
      this.setState({
        isOnTheTabWrapper: true,
      });
    } else if (top > targetTop && this.state.isOnTheTabWrapper) {
      this.setState({
        isOnTheTabWrapper: false,
      });
    }
  };

  private handleToggleAuthorBox = () => {
    const { dispatch } = this.props;

    dispatch(toggleAuthorBox());
  };

  private toggleCitationDialog = () => {
    const { dispatch } = this.props;

    dispatch(toggleCitationDialog());
  };

  private checkCurrentBookmarkedStatus = () => {
    const { dispatch, paperShow, currentUser } = this.props;

    if (paperShow.paper && currentUser.isLoggedIn) {
      dispatch(getBookmarkedStatus(paperShow.paper));

      if (paperShow.referencePapers && !paperShow.referencePapers.isEmpty()) {
        dispatch(getBookmarkedStatusList(paperShow.referencePapers));
      }

      if (paperShow.citedPapers && !paperShow.citedPapers.isEmpty()) {
        dispatch(getBookmarkedStatusList(paperShow.citedPapers));
      }
    }
  };

  private toggleBookmark = () => {
    const { paperShow } = this.props;

    if (paperShow.isBookmarked) {
      this.handleRemoveBookmark(paperShow.paper);
      trackEvent({ category: "paper-show", action: "remove-bookmark", label: `${paperShow.paper.id}` });
    } else {
      this.handlePostBookmark(paperShow.paper);
      trackEvent({ category: "paper-show", action: "active-bookmark", label: `${paperShow.paper.id}` });
    }
  };

  private handleClickCitedPapersPagination = (pageIndex: number) => {
    this.scrollToCitedPapersNode();
    this.fetchCitedPapers(pageIndex);
  };

  private handleClickReferencePapersPagination = (pageIndex: number) => {
    this.scrollToReferencePapersNode();
    this.fetchReferencePapers(pageIndex);
  };

  private scrollToCitedPapersNode = () => {
    if (!EnvChecker.isServer()) {
      const targetHeight = this.citedPapersWrapper && this.citedPapersWrapper.offsetTop;
      window.scrollTo(0, targetHeight - 76);
    }
  };

  private scrollToReferencePapersNode = () => {
    if (!EnvChecker.isServer()) {
      const targetHeight = this.referencePapersWrapper && this.referencePapersWrapper.offsetTop;
      window.scrollTo(0, targetHeight - 76);
    }
  };

  private scrollToRelatedPapersNode = () => {
    const { location } = this.props;

    if (location.hash === "#cited") {
      this.scrollToCitedPapersNode();
    } else if (location.hash === "#references") {
      this.scrollToReferencePapersNode();
    }
  };

  private handlePostBookmark = (paper: PaperRecord) => {
    const { dispatch, currentUser } = this.props;

    if (!currentUser.isLoggedIn) {
      return checkAuthDialog();
    }

    const hasRightToPostComment = currentUser.oauthLoggedIn || currentUser.emailVerified;

    if (!hasRightToPostComment) {
      return dispatch(openVerificationNeeded());
    }

    dispatch(postBookmark(paper));
  };

  private handleRemoveBookmark = (paper: PaperRecord) => {
    const { dispatch, currentUser } = this.props;

    if (!currentUser.isLoggedIn) {
      checkAuthDialog();
    }

    const hasRightToPostComment = currentUser.oauthLoggedIn || currentUser.emailVerified;

    if (!hasRightToPostComment) {
      return dispatch(openVerificationNeeded());
    }

    dispatch(removeBookmark(paper));
  };

  private getCitationBox = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (paper.doi) {
      return (
        <div onClick={this.toggleCitationDialog} className={styles.citationButton}>
          <div>CITE THIS PAPER</div>
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
        <a
          className={styles.viewInSourceButtonWrapper}
          href={source}
          onClick={() => {
            trackAndOpenLink("View In Source(paperShow)");
          }}
          target="_blank"
        >
          <Icon className={styles.sourceIcon} icon="EXTERNAL_SOURCE" />
          <span>VIEW IN SOURCE</span>
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
        <button onClick={this.clickDOIButton} className={styles.DOIButton}>
          <span className={styles.informationSubtitle}>DOI</span>
          <span>{` | ${paper.doi}`}</span>
        </button>
      );
    } else {
      return null;
    }
  };

  private clickDOIButton = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    copySelectedTextToClipboard(`https://dx.doi.org/${paper.doi}`);
    trackEvent({ category: "paper-show", action: "copy-DOI", label: paper.id.toString() });
  };

  private toggleAuthors = (paperId: number, relatedPapersType: RELATED_PAPERS) => {
    const { dispatch } = this.props;

    dispatch(toggleAuthors(paperId, relatedPapersType));
  };

  private toggleAbstract = (paperId: number, relatedPapersType: RELATED_PAPERS) => {
    const { dispatch } = this.props;

    dispatch(toggleAbstract(paperId, relatedPapersType));
  };

  private handleClickCitationTab = (tab: AvailableCitationType) => {
    const { dispatch, paperShow } = this.props;

    dispatch(handleClickCitationTab(tab));
    dispatch(getCitationText({ type: tab, paperId: paperShow.paper.id }));
    trackEvent({ category: "paper-show", action: "click-citation-tab", label: AvailableCitationType[tab] });
  };

  private visitTitle = (paperId: number, relatedPapersType: RELATED_PAPERS) => {
    const { dispatch } = this.props;

    dispatch(visitTitle(paperId, relatedPapersType));
  };

  private closeFirstOpen = (paperId: number, relatedPapersType: RELATED_PAPERS) => {
    const { dispatch } = this.props;

    dispatch(closeFirstOpen(paperId, relatedPapersType));
  };

  private getTabs = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    return (
      <div
        className={classNames({
          [`${styles.tabWrapper}`]: true,
          [`${styles.overTabWrapper}`]: this.state.isOnTheTabWrapper,
          [`${styles.underTabWrapper}`]: !this.state.isOnTheTabWrapper,
        })}
      >
        <div className={styles.tabBackground} />
        <span onClick={this.scrollToReferencePapersNode} className={styles.tabButton}>
          {`References (${paper.referenceCount})`}
        </span>
        <span onClick={this.scrollToCitedPapersNode} className={styles.tabButton}>
          {`Cited by (${paper.citedCount})`}
        </span>
      </div>
    );
  };

  private fetchCitedPapers = (page = 0) => {
    const { match, dispatch, paperShow } = this.props;
    const targetPaperId = paperShow.paper ? paperShow.paper.id : parseInt(match.params.paperId, 10);

    dispatch(
      getCitedPapers({
        paperId: paperShow.paper.id,
        page,
        filter: "year=:,if=:",
      }),
    );

    trackEvent({ category: "paper-show", action: "fetch-cited-papers", label: `${targetPaperId} - ${page}` });
  };

  private fetchReferencePapers = (page = 0) => {
    const { dispatch, paperShow, match } = this.props;
    const targetPaperId = paperShow.paper ? paperShow.paper.id : parseInt(match.params.paperId, 10);

    dispatch(
      getReferencePapers({
        paperId: paperShow.paper.id,
        page,
        filter: "year=:,if=:",
      }),
    );

    trackEvent({ category: "paper-show", action: "fetch-refs-papers", label: `${targetPaperId} - ${page}` });
  };

  private fetchRelatedPapers = () => {
    this.fetchCitedPapers();
    this.fetchReferencePapers();
  };

  private getPDFDownloadButton = () => {
    const { paperShow } = this.props;

    const pdfSourceRecord = paperShow.paper.urls.find((paperSource: IPaperSourceRecord) => {
      return paperSource.url.includes(".pdf");
    });

    if (pdfSourceRecord) {
      return (
        <a className={styles.pdfButtonWrapper} href={pdfSourceRecord.url} target="_blank">
          <Icon className={styles.pdfIconWrapper} icon="DOWNLOAD" />
          <span>DOWNLOAD PDF</span>
        </a>
      );
    } else {
      return null;
    }
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

    return `${shortAbstract}${shortAuthors}${shortJournals} | sci-napse`;
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
          <span className={styles.informationSubtitle}>PUBLISHED</span>
          {` | ${paperShow.paper.year} in ${journal.fullTitle || paperShow.paper.venue}`}
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
    const { dispatch, paperShow } = this.props;

    dispatch(getComments({ paperId: paperShow.paper.id, page: pageIndex }));
  };
}

export default connect(mapStateToProps)(withRouter(PaperShow));
