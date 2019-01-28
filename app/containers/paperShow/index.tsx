import * as React from "react";
import axios from "axios";
import { stringify } from "qs";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import * as classNames from "classnames";
import Helmet from "react-helmet";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import ArticleSpinner from "../../components/common/spinner/articleSpinner";
import { clearPaperShowState } from "../../actions/paperShow";
import PaperShowJournalItem from "../../components/paperShow/journalItem";
import PaperShowDOI from "../../components/paperShow/DOI";
import { PaperShowState } from "./records";
import AuthorList from "../../components/paperShow/components/authorList";
import RelatedPaperList from "../relatedPapers";
import OtherPaperListFromAuthor from "../otherPapersFromAuthor";
import PaperShowActionBar from "../paperShowActionBar";
import FOSList from "../../components/paperShow/components/fosList";
import ReferencePapers from "../../components/paperShow/components/relatedPapers";
import SearchKeyword from "../../components/paperShow/components/searchKeyword";
import PaperShowRefCitedTab from "../../components/paperShow/refCitedTab";
import { Footer } from "../../components/layouts";
import { Configuration } from "../../reducers/configuration";
import { Paper } from "../../model/paper";
import { fetchPaperShowData, fetchRefPaperData, fetchCitedPaperData, fetchMyCollection } from "./sideEffect";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import CollectionNoteList from "../../components/paperShow/components/collectionNoteList";
import { LayoutState, UserDevice } from "../../components/layouts/records";
import FailedToLoadPaper from "../../components/paperShow/failedToLoadPaper";
import { trackEvent } from "../../helpers/handleGA";
import { getMemoizedPaper, getReferencePapers, getCitedPapers } from "./select";
import { formulaeToHTMLStr } from "../../helpers/displayFormula";
import PlutoBlogPosting from "../../components/paperShow/components/plutoBlogPosting";
import { getPDFLink } from "../../helpers/getPDFLink";
import restoreScroll from "../../helpers/scrollRestoration";
const styles = require("./paperShow.scss");

const PAPER_SHOW_MARGIN_TOP = parseInt(styles.paperShowMarginTop, 10);
const NAVBAR_HEIGHT = parseInt(styles.navbarHeight, 10);
const SIDE_NAVIGATION_BOTTOM_PADDING = parseInt(styles.sideNavigationBottomPadding, 10);

let ticking = false;

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
    paperShow: state.paperShow,
    configuration: state.configuration,
    paper: getMemoizedPaper(state),
    referencePapers: getReferencePapers(state),
    citedPapers: getCitedPapers(state),
  };
}

export interface PaperShowPageQueryParams {
  "ref-page"?: number;
  "cited-page"?: number;
}

export interface PaperShowMatchParams {
  paperId: string;
}

export interface PaperShowProps extends RouteComponentProps<PaperShowMatchParams> {
  layout: LayoutState;
  currentUser: CurrentUser;
  paperShow: PaperShowState;
  configuration: Configuration;
  dispatch: Dispatch<any>;
  paper: Paper | null;
  referencePapers: Paper[];
  citedPapers: Paper[];
}

interface PaperShowStates
  extends Readonly<{
      isAboveRef: boolean;
      isOnRef: boolean;
      isOnCited: boolean;

      isRightBoxSmall: boolean;
      isRightBoxFixed: boolean;
      isTouchFooter: boolean;
    }> {}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, PaperShowStates> {
  private cancelToken = axios.CancelToken.source();
  private refTabWrapper: HTMLDivElement | null;
  private citedTabWrapper: HTMLDivElement | null;
  private rightBoxWrapper: HTMLDivElement | null;
  private footerWrapper: HTMLDivElement | null;

  constructor(props: PaperShowProps) {
    super(props);

    this.state = {
      isAboveRef: true,
      isOnRef: false,
      isOnCited: false,
      isRightBoxSmall: false,
      isRightBoxFixed: false,
      isTouchFooter: false,
    };
  }

  public async componentDidMount() {
    const { configuration, currentUser, dispatch, match, location } = this.props;
    const queryParams: PaperShowPageQueryParams = getQueryParamsObject(location.search);
    const notRenderedAtServerOrJSAlreadyInitialized =
      !configuration.succeedAPIFetchAtServer || configuration.renderedAtClient;

    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScrollEvent();

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      await fetchPaperShowData(
        {
          dispatch,
          match,
          pathname: location.pathname,
          queryParams,
          cancelToken: this.cancelToken.token,
        },
        currentUser
      );

      this.scrollToRefCitedSection();
    }
  }

  public async componentWillReceiveProps(nextProps: PaperShowProps) {
    const { dispatch, match, location, currentUser } = this.props;
    const prevQueryParams: PaperShowPageQueryParams = getQueryParamsObject(location.search);
    const nextQueryParams: PaperShowPageQueryParams = getQueryParamsObject(nextProps.location.search);

    const moveToDifferentPage = match.params.paperId !== nextProps.match.params.paperId;
    const changeRefPage = prevQueryParams["ref-page"] !== nextQueryParams["ref-page"];
    const changeCitedPage = prevQueryParams["cited-page"] !== nextQueryParams["cited-page"];

    if (moveToDifferentPage) {
      await fetchPaperShowData(
        {
          dispatch,
          match: nextProps.match,
          pathname: nextProps.location.pathname,
          queryParams: nextQueryParams,
          cancelToken: this.cancelToken.token,
        },
        currentUser
      );
      return this.scrollToRefCitedSection();
    }

    if (
      currentUser.isLoggedIn !== nextProps.currentUser.isLoggedIn &&
      nextProps.currentUser.isLoggedIn &&
      nextProps.paper
    ) {
      return dispatch(fetchMyCollection(nextProps.paper.id, this.cancelToken.token));
    }

    if (nextProps.paper && changeRefPage) {
      dispatch(fetchRefPaperData(nextProps.paper.id, nextQueryParams["ref-page"], this.cancelToken.token));
    } else if (nextProps.paper && changeCitedPage) {
      dispatch(fetchCitedPaperData(nextProps.paper.id, nextQueryParams["cited-page"], this.cancelToken.token));
    }
  }

  public componentDidUpdate(prevProps: PaperShowProps) {
    const { paper, location } = this.props;

    const isPaperChanged = paper && prevProps.paper && paper.id !== prevProps.paper.id;

    if ((!prevProps.paper && paper) || (isPaperChanged && !location.hash)) {
      this.handleScrollEvent();
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    this.cancelToken.cancel();
    dispatch(clearPaperShowState());
    window.removeEventListener("scroll", this.handleScroll);
  }

  public render() {
    const { layout, paperShow, location, currentUser, paper, referencePapers, citedPapers } = this.props;
    const { isOnCited, isOnRef, isAboveRef, isRightBoxFixed, isRightBoxSmall, isTouchFooter } = this.state;

    if (paperShow.isLoadingPaper) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    }

    if (paperShow.hasErrorOnFetchingPaper) {
      return <FailedToLoadPaper />;
    }

    if (!paper) {
      return null;
    }

    return (
      <div className={styles.container}>
        {this.getPageHelmet()}
        <article className={styles.paperShow}>
          <div className={styles.paperShowContent}>
            <div className={styles.paperTitle} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.title) }} />
            <div className={styles.paperContentBlockDivider} />
            <div className={styles.actionBarWrapper}>
              <PaperShowActionBar paper={paper} />
            </div>
            <div className={styles.paperContentBlockDivider} />
            <div className={styles.paperInfo}>
              <AuthorList paper={paper} authors={paper.authors} />
              <PaperShowJournalItem paper={paper} />
              <PaperShowDOI paper={paper} DOI={paper.doi} />
            </div>
            <div className={styles.paperContentBlockDivider} />
            <div className={styles.paperContent}>
              <div className={styles.abstract}>
                <div className={styles.paperContentBlockHeader}>Abstract</div>
              </div>
              <div
                className={styles.abstractContent}
                dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.abstract) }}
              />
              <div className={styles.fos}>
                <FOSList FOSList={paper.fosList} />
              </div>
            </div>
            <div className={styles.paperContentBlockDivider} />
            <div className={styles.otherPapers}>
              <div className={styles.refCitedTabWrapper} ref={el => (this.refTabWrapper = el)}>
                <PaperShowRefCitedTab
                  referenceCount={paper.referenceCount}
                  citedCount={paper.citedCount}
                  handleClickRef={this.scrollToReferencePapersNode}
                  handleClickCited={this.scrollToCitedPapersNode}
                  isFixed={isOnRef && !isOnCited}
                  isOnRef={isAboveRef || isOnRef}
                  isOnCited={isOnCited}
                />
              </div>

              <div className={styles.references}>
                <ReferencePapers
                  type="reference"
                  isMobile={layout.userDevice !== UserDevice.DESKTOP}
                  papers={referencePapers}
                  currentUser={currentUser}
                  paperShow={paperShow}
                  getLinkDestination={this.getReferencePaperPaginationLink}
                  location={location}
                />
              </div>
              <div className={styles.citedBy}>
                <div className={styles.refCitedTabWrapper} ref={el => (this.citedTabWrapper = el)}>
                  <PaperShowRefCitedTab
                    referenceCount={paper.referenceCount}
                    citedCount={paper.citedCount}
                    handleClickRef={this.scrollToReferencePapersNode}
                    handleClickCited={this.scrollToCitedPapersNode}
                    isFixed={!isOnRef && isOnCited}
                    isOnRef={false}
                    isOnCited={true}
                  />
                </div>
              </div>
              <ReferencePapers
                type="cited"
                isMobile={layout.userDevice !== UserDevice.DESKTOP}
                papers={citedPapers}
                currentUser={currentUser}
                paperShow={paperShow}
                getLinkDestination={this.getCitedPaperPaginationLink}
                location={location}
              />
            </div>
          </div>

          <div ref={el => (this.footerWrapper = el)}>
            <Footer />
          </div>
        </article>
        <div className={styles.rightBox}>
          <div
            ref={el => (this.rightBoxWrapper = el)}
            className={classNames({
              [styles.sideNavigation]: true,
              [styles.stick]: isRightBoxFixed,
              [styles.smallThanVH]: isRightBoxSmall,
              [styles.touchFooter]: isTouchFooter,
            })}
          >
            <CollectionNoteList />
            <OtherPaperListFromAuthor />
            <RelatedPaperList />
            <SearchKeyword FOSList={paper.fosList} />
            <PlutoBlogPosting paperId={paperShow.paperId} />
          </div>
        </div>
      </div>
    );
  }

  private scrollToRefCitedSection = () => {
    const { paperShow, location } = this.props;

    if (paperShow.citedPaperCurrentPage === 1 && location.hash === "#cited") {
      this.scrollToCitedPapersNode();
    } else if (paperShow.referencePaperCurrentPage === 1 && location.hash === "#references") {
      this.scrollToReferencePapersNode();
    } else {
      restoreScroll(location.key);
    }
  };

  private handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(this.handleScrollEvent);
    }
    ticking = true;
  };

  private handleScrollEvent = () => {
    const { isRightBoxFixed, isTouchFooter, isRightBoxSmall } = this.state;
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const viewportHeight = window.innerHeight;
    const windowBottom = scrollTop + viewportHeight;

    // right box
    if (this.rightBoxWrapper && this.footerWrapper) {
      const offsetHeight = this.rightBoxWrapper.offsetHeight;
      const rightBoxFullHeight = offsetHeight + NAVBAR_HEIGHT + PAPER_SHOW_MARGIN_TOP + SIDE_NAVIGATION_BOTTOM_PADDING;
      const isShorterThanScreenHeight = offsetHeight < viewportHeight - NAVBAR_HEIGHT - PAPER_SHOW_MARGIN_TOP;
      const isScrollOverRightBox = windowBottom > rightBoxFullHeight;
      const isScrollTouchFooter = windowBottom - SIDE_NAVIGATION_BOTTOM_PADDING >= this.footerWrapper.offsetTop;

      if (isShorterThanScreenHeight) {
        this.setState(prevState => ({ ...prevState, isRightBoxSmall: true, isRightBoxFixed: true }));
      } else if (!isShorterThanScreenHeight) {
        this.setState(prevState => ({ ...prevState, isRightBoxSmall: false }));
      }

      if (isRightBoxFixed && !isScrollOverRightBox) {
        this.setState(prevState => ({ ...prevState, isRightBoxFixed: false }));
      } else if (!isRightBoxFixed && isScrollOverRightBox) {
        this.setState(prevState => ({ ...prevState, isRightBoxFixed: true }));
      }

      if (!isTouchFooter && isScrollOverRightBox && isScrollTouchFooter && !isRightBoxSmall) {
        this.setState(prevState => ({ ...prevState, isTouchFooter: true }));
      } else if (isTouchFooter && isScrollOverRightBox && !isScrollTouchFooter) {
        this.setState(prevState => ({ ...prevState, isTouchFooter: false }));
      }
    }

    // ref/cited tab
    if (this.refTabWrapper && this.citedTabWrapper) {
      const refOffsetTop = this.refTabWrapper.offsetTop;
      const citedOffsetTop = this.citedTabWrapper.offsetTop;

      if (!this.state.isAboveRef && scrollTop + NAVBAR_HEIGHT < refOffsetTop) {
        this.setState(prevState => ({ ...prevState, isAboveRef: true, isOnCited: false, isOnRef: false }));
      } else if (
        !this.state.isOnRef &&
        scrollTop + NAVBAR_HEIGHT >= refOffsetTop &&
        scrollTop + NAVBAR_HEIGHT < citedOffsetTop
      ) {
        this.setState(prevState => ({ ...prevState, isAboveRef: false, isOnCited: false, isOnRef: true }));
      } else if (!this.state.isOnCited && scrollTop + NAVBAR_HEIGHT >= citedOffsetTop) {
        this.setState(prevState => ({ ...prevState, isAboveRef: false, isOnCited: true, isOnRef: false }));
      }
    }

    ticking = false;
  };

  private getCitedPaperPaginationLink = (page: number) => {
    const { paper, location } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...{ "cited-page": page },
    };
    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true,
    });

    return {
      to: `/papers/${paper ? paper.id : 0}`,
      search: stringifiedQueryParams,
    };
  };

  private getReferencePaperPaginationLink = (page: number) => {
    const { paper, location } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...{ "ref-page": page },
    };
    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true,
    });

    return {
      to: `/papers/${paper ? paper.id : 0}`,
      search: stringifiedQueryParams,
    };
  };

  private scrollToCitedPapersNode = () => {
    if (this.citedTabWrapper) {
      this.citedTabWrapper.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      trackEvent({
        category: "New Paper Show",
        action: "Click Cited by Tab in Paper Show refBar",
        label: "Click Cited by Tab",
      });
    }
  };

  private scrollToReferencePapersNode = () => {
    if (this.refTabWrapper) {
      this.refTabWrapper.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      trackEvent({
        category: "New Paper Show",
        action: "Click References Tab in Paper Show refBar",
        label: "Click References Tab",
      });
    }
  };

  private buildPageDescription = () => {
    const { paper } = this.props;

    if (!paper) {
      return "Scinapse";
    }

    const shortAbstract = paper.abstract ? `${paper.abstract.slice(0, 110)} | ` : "";
    const shortAuthors =
      paper.authors && paper.authors.length > 0
        ? `${paper.authors
            .map(author => {
              return author!.name;
            })
            .join(", ")
            .slice(0, 50)}  | `
        : "";
    const shortJournals = paper.journal ? `${paper.journal!.title!.slice(0, 50)} | ` : "";
    return `${shortAbstract}${shortAuthors}${shortJournals}`;
    // }
  };

  private makeStructuredData = (paper: Paper) => {
    const authorsForStructuredData = paper.authors.map(author => {
      return {
        "@type": "Person",
        name: author!.name,
        affiliation: {
          name: author!.organization,
        },
      };
    });

    const publisherForStructuredData = {
      "@type": "Organization",
      name: "Scinapse",
      logo: {
        "@type": "ImageObject",
        url: "https://assets.pluto.network/scinapse/scinapse-logo.png",
      },
    };

    const structuredData: any = {
      "@context": "http://schema.org",
      "@type": "Article",
      headline: paper.title,
      image: ["https://assets.pluto.network/scinapse/scinapse-logo.png"],
      datePublished: paper.publishedDate,
      dateModified: paper.publishedDate,
      author: authorsForStructuredData,
      keywords: paper.fosList.map(fos => fos!.fos),
      description: paper.abstract,
      mainEntityOfPage: "https://scinapse.io",
      publisher: publisherForStructuredData,
    };

    return structuredData;
  };

  private getPageHelmet = () => {
    const { paper } = this.props;
    if (paper) {
      const pdfSourceRecord = getPDFLink(paper.urls);

      const metaTitleContent = pdfSourceRecord ? "[PDF] " + paper.title : paper.title;
      const fosListContent =
        paper.fosList && typeof paper.fosList !== "undefined"
          ? paper.fosList
              .map(fos => {
                return fos.fos;
              })
              .toString()
              .replace(/,/gi, ", ")
          : "";

      return (
        <Helmet>
          <title>{metaTitleContent} | Scinapse | Academic search engine for paper}</title>
          <meta itemProp="name" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
          <meta name="description" content={this.buildPageDescription()} />
          <meta name="keyword" content={fosListContent} />
          <meta name="twitter:description" content={this.buildPageDescription()} />
          <meta name="twitter:card" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
          <meta name="twitter:title" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
          <meta property="og:title" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://scinapse.io/papers/${paper.id}`} />
          <meta property="og:description" content={this.buildPageDescription()} />
          <script type="application/ld+json">{JSON.stringify(this.makeStructuredData(paper))}</script>
        </Helmet>
      );
    }
  };
}

export default connect(mapStateToProps)(withRouter(PaperShow));
