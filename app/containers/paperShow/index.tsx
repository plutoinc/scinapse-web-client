import * as React from "react";
import axios from "axios";
import { stringify } from "qs";
import NoSsr from "@material-ui/core/NoSsr";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import Helmet from "react-helmet";
import PDFViewer from "../../components/pdfViewer";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import ArticleSpinner from "../../components/common/spinner/articleSpinner";
import { clearPaperShowState, getBestPdfOfPaper } from "../../actions/paperShow";
import { PaperShowState } from "./records";
import ActionBar from "../paperShowActionBar";
import FOSList from "../../components/paperShow/components/fosList";
import ReferencePapers from "../../components/paperShow/components/relatedPapers";
import PaperShowRefCitedTab from "../../components/paperShow/refCitedTab";
import { Footer } from "../../components/layouts";
import { Configuration } from "../../reducers/configuration";
import { Paper } from "../../model/paper";
import { fetchCitedPaperData, fetchMyCollection, fetchPaperShowData, fetchRefPaperData } from "./sideEffect";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import { LayoutState, UserDevice } from "../../components/layouts/records";
import { trackEvent } from "../../helpers/handleGA";
import { getCitedPapers, getMemoizedPaper, getReferencePapers } from "./select";
import { formulaeToHTMLStr } from "../../helpers/displayFormula";
import { getPDFLink } from "../../helpers/getPDFLink";
import restoreScroll from "../../helpers/scrollRestoration";
import ErrorPage from "../../components/error/errorPage";
import EnvChecker from "../../helpers/envChecker";
import NextPaperTab from "../nextPaperTab";
import { PaperShowMatchParams, PaperShowPageQueryParams } from "./types";
import VenueAndAuthors from "../../components/common/paperItem/venueAndAuthors";
import { ArticleSearchState } from "../../components/articleSearch/records";
import PapersQueryFormatter from "../../helpers/papersQueryFormatter";
import Icon from "../../icons";
import ActionTicketManager from "../../helpers/actionTicketManager";
import SignUpBanner from "../../components/paperShow/components/signUpBanner";

const styles = require("./paperShow.scss");

const NAVBAR_HEIGHT = parseInt(styles.navbarHeight, 10) + 1;
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
    articleSearch: state.articleSearch,
  };
}

export interface PaperShowProps extends RouteComponentProps<PaperShowMatchParams> {
  layout: LayoutState;
  currentUser: CurrentUser;
  paperShow: PaperShowState;
  configuration: Configuration;
  articleSearch: ArticleSearchState;
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
      isOnFullText: boolean;

      isLoadPDF: boolean;
      failedToLoadPDF: boolean;

      isLoadingOaPDFCheck: boolean;
    }> {}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, PaperShowStates> {
  private cancelToken = axios.CancelToken.source();
  private fullTextTabWrapper: HTMLDivElement | null;
  private refTabWrapper: HTMLDivElement | null;
  private citedTabWrapper: HTMLDivElement | null;

  constructor(props: PaperShowProps) {
    super(props);

    this.state = {
      isAboveRef: true,
      isOnRef: false,
      isOnCited: false,
      isOnFullText: false,
      isLoadPDF: false,
      failedToLoadPDF: false,
      isLoadingOaPDFCheck: false,
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

  public async componentDidUpdate(prevProps: PaperShowProps) {
    const { dispatch, match, location, currentUser } = prevProps;
    const prevQueryParams: PaperShowPageQueryParams = getQueryParamsObject(location.search);
    const nextQueryParams: PaperShowPageQueryParams = getQueryParamsObject(this.props.location.search);

    const moveToDifferentPage = match.params.paperId !== this.props.match.params.paperId;
    const changeRefPage = prevQueryParams["ref-page"] !== nextQueryParams["ref-page"];
    const changeCitedPage = prevQueryParams["cited-page"] !== nextQueryParams["cited-page"];

    if (moveToDifferentPage) {
      await fetchPaperShowData(
        {
          dispatch,
          match: this.props.match,
          pathname: this.props.location.pathname,
          queryParams: nextQueryParams,
          cancelToken: this.cancelToken.token,
        },
        currentUser
      );
      this.scrollToRefCitedSection();
      return this.handleScrollEvent();
    }

    if (
      currentUser.isLoggedIn !== this.props.currentUser.isLoggedIn &&
      this.props.currentUser.isLoggedIn &&
      this.props.paper
    ) {
      return dispatch(fetchMyCollection(this.props.paper.id, this.cancelToken.token));
    }

    if (this.props.paper && changeRefPage) {
      dispatch(fetchRefPaperData(this.props.paper.id, nextQueryParams["ref-page"], this.cancelToken.token));
    } else if (this.props.paper && changeCitedPage) {
      dispatch(fetchCitedPaperData(this.props.paper.id, nextQueryParams["cited-page"], this.cancelToken.token));
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    this.cancelToken.cancel();
    dispatch(clearPaperShowState());
    window.removeEventListener("scroll", this.handleScroll);
  }

  public render() {
    const { layout, paperShow, location, currentUser, paper, referencePapers, citedPapers, dispatch } = this.props;
    const { isOnFullText, isOnCited, isOnRef, isLoadPDF, failedToLoadPDF } = this.state;
    const hasBest = !!(paper && !!paper.bestPdf && paper.bestPdf.hasBest);

    if (paperShow.isLoadingPaper) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    }

    if (paperShow.hasErrorOnFetchingPaper) {
      return <ErrorPage errorNum={paperShow.hasErrorOnFetchingPaper} />;
    }

    if (!paper) {
      return null;
    }

    return (
      <>
        <div className={styles.container}>
          {this.getPageHelmet()}
          <article className={styles.paperShow}>
            <div className={styles.paperShowContent}>
              {this.getGoBackResultBtn()}
              <h1 className={styles.paperTitle} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(paper.title) }} />
              <VenueAndAuthors
                pageType={"paperShow"}
                actionArea={"paperDescription"}
                paper={paper}
                journal={paper.journal}
                conferenceInstance={paper.conferenceInstance}
                publishedDate={paper.publishedDate}
                authors={paper.authors}
              />
              <div className={styles.paperContentBlockDivider} />
              <div className={styles.actionBarWrapper}>
                <NoSsr>
                  <ActionBar
                    paper={paper}
                    hasBestPdf={!!paper.bestPdf ? paper.bestPdf.hasBest : false}
                    isLoadingOaCheck={paperShow.isOACheckingPDF}
                    isFetcingPDF={paperShow.isFetchingPdf}
                    failedToLoadPDF={failedToLoadPDF}
                    currentUser={currentUser}
                    showFullText={isLoadPDF}
                    handleClickFullText={this.scrollToSection("fullText")}
                  />
                </NoSsr>
              </div>
              <div className={styles.paperContentBlockDivider} />
              <div className={styles.paperContent}>
                <NoSsr>
                  <SignUpBanner isLoggedIn={currentUser.isLoggedIn} />
                </NoSsr>
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
            </div>
          </article>
          <div>
            {hasBest && (
              <div className={styles.refCitedTabWrapper} ref={el => (this.fullTextTabWrapper = el)}>
                <PaperShowRefCitedTab
                  paper={paper}
                  handleClickFullText={this.scrollToSection("fullText")}
                  handleClickRef={this.scrollToSection("ref")}
                  handleClickCited={this.scrollToSection("cited")}
                  isLoadingOaCheck={paperShow.isOACheckingPDF}
                  hasBestPdf={hasBest}
                  isFetchingPdf={paperShow.isFetchingPdf}
                  failedToLoadPDF={failedToLoadPDF}
                  isFixed={isOnFullText}
                  isOnRef={isOnRef}
                  isOnCited={isOnCited}
                  isOnFullText={isOnFullText || (!isOnFullText && !isOnRef && !isOnCited)}
                  showFullText={!failedToLoadPDF}
                />
              </div>
            )}
            <PDFViewer
              dispatch={dispatch}
              paperId={paper.id}
              onLoadSuccess={this.handleSucceedToLoadPDF}
              onFailed={this.handleFailedToLoadPDF}
              handleGetBestPdf={this.getBestPdfOfPaperInPaperShow}
              filename={paper.title}
              bestPdf={paper.bestPdf}
              sources={paper.urls}
              shouldShow={!EnvChecker.isOnServer() && layout.userDevice === UserDevice.DESKTOP}
            />
          </div>
          <div className={styles.refCitedTabWrapper} ref={el => (this.refTabWrapper = el)}>
            <PaperShowRefCitedTab
              paper={paper}
              handleClickRef={this.scrollToSection("ref")}
              handleClickCited={this.scrollToSection("cited")}
              handleClickFullText={this.scrollToSection("fullText")}
              hasBestPdf={hasBest}
              isLoadingOaCheck={paperShow.isOACheckingPDF}
              isFetchingPdf={paperShow.isFetchingPdf}
              failedToLoadPDF={failedToLoadPDF}
              isFixed={isOnRef}
              isOnRef={isOnRef}
              isOnCited={isOnCited}
              showFullText={!failedToLoadPDF && isLoadPDF}
            />
          </div>
          <div className={styles.citedBy}>
            <article className={styles.paperShow}>
              <div>
                <span className={styles.sectionTitle}>References</span>
                <span className={styles.sectionCount}>{paper.referenceCount}</span>
              </div>
              <div className={styles.otherPapers}>
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
              </div>
            </article>
          </div>
          <div className={styles.sectionDivider} />
          <div className={styles.refCitedTabWrapper} ref={el => (this.citedTabWrapper = el)}>
            <PaperShowRefCitedTab
              paper={paper}
              handleClickRef={this.scrollToSection("ref")}
              handleClickCited={this.scrollToSection("cited")}
              handleClickFullText={this.scrollToSection("fullText")}
              hasBestPdf={hasBest}
              isLoadingOaCheck={paperShow.isOACheckingPDF}
              isFetchingPdf={paperShow.isFetchingPdf}
              failedToLoadPDF={failedToLoadPDF}
              isFixed={isOnCited}
              isOnRef={isOnRef}
              isOnCited={isOnCited}
              showFullText={isLoadPDF}
            />
          </div>
          <div className={styles.citedBy}>
            <article className={styles.paperShow}>
              <div>
                <span className={styles.sectionTitle}>Cited By</span>
                <span className={styles.sectionCount}>{paper.citedCount}</span>
              </div>
              <div className={styles.otherPapers}>
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
            </article>
          </div>
        </div>
        <div className={styles.footerWrapper}>
          <Footer />
        </div>
        <NextPaperTab />
      </>
    );
  }

  private getGoBackResultBtn = () => {
    const { articleSearch, history } = this.props;

    if (articleSearch.searchInput && articleSearch.searchInput.length > 0) {
      return (
        <div
          className={styles.goBackBtn}
          onClick={() => {
            history.push({
              pathname: "/search",
              search: PapersQueryFormatter.stringifyPapersQuery({
                query: articleSearch.searchInput,
                page: 1,
                sort: "RELEVANCE",
                filter: PapersQueryFormatter.objectifyPapersFilter(),
              }),
            });
          }}
        >
          <Icon icon="BACK" className={styles.backIcon} /> BACK TO RESULTS
        </div>
      );
    }
  };

  private handleSucceedToLoadPDF = () => {
    const { paper } = this.props;

    this.setState(prevState => ({ ...prevState, isLoadPDF: true, failedToLoadPDF: false }));

    ActionTicketManager.trackTicket({
      pageType: "paperShow",
      actionType: "view",
      actionArea: "pdfViewer",
      actionTag: "viewPDF",
      actionLabel: paper && String(paper.id),
    });
  };

  private handleFailedToLoadPDF = () => {
    this.setState(prevState => ({ ...prevState, failedToLoadPDF: true, isLoadPDF: false }));
  };

  private getBestPdfOfPaperInPaperShow = () => {
    const { paper, dispatch } = this.props;
    if (paper) {
      try {
        this.setState(prevState => ({ ...prevState, isLoadingOaPDFCheck: true }));
        const res = dispatch(getBestPdfOfPaper({ paperId: paper.id }));
        res.then(result => {
          if (result.hasBest) {
            this.setState(prevState => ({ ...prevState, isLoadPDF: true, isLoadingOaPDFCheck: false }));
          } else {
            this.setState(prevState => ({ ...prevState, isLoadPDF: false, isLoadingOaPDFCheck: false }));
          }
        });
        return res;
      } catch (err) {
        this.setState(prevState => ({
          ...prevState,
          isLoadPDF: false,
          failedToLoadPDF: true,
          isLoadingOaPDFCheck: false,
        }));
        console.error(err);
      }
      this.setState(prevState => ({
        ...prevState,
        isLoadingOaPDFCheck: false,
      }));
    } else {
      return;
    }
  };

  private scrollToRefCitedSection = () => {
    const { paperShow, location } = this.props;

    if (paperShow.citedPaperCurrentPage === 1 && location.hash === "#cited") {
      this.scrollToSection("cited");
    } else if (paperShow.referencePaperCurrentPage === 1 && location.hash === "#references") {
      this.scrollToSection("ref");
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
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    // ref/cited tab
    if (this.fullTextTabWrapper && this.refTabWrapper && this.citedTabWrapper) {
      const fullTextOffsetTop = this.fullTextTabWrapper.offsetTop;
      const refOffsetTop = this.refTabWrapper.offsetTop;
      const citedOffsetTop = this.citedTabWrapper.offsetTop;
      const currentScrollTop = scrollTop + NAVBAR_HEIGHT;

      if (citedOffsetTop === 0 && refOffsetTop === 0 && fullTextOffsetTop === 0) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: false,
          isOnRef: false,
          isOnCited: false,
          isAboveRef: false,
        }));
      } else if (fullTextOffsetTop > currentScrollTop) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: false,
          isOnRef: false,
          isOnCited: false,
          isAboveRef: true,
        }));
      } else if (currentScrollTop >= fullTextOffsetTop && currentScrollTop < refOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: true,
          isOnRef: false,
          isOnCited: false,
          isAboveRef: true,
        }));
      } else if (currentScrollTop >= refOffsetTop && currentScrollTop < citedOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: false,
          isOnRef: true,
          isOnCited: false,
          isAboveRef: false,
        }));
      } else if (currentScrollTop >= citedOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: false,
          isOnRef: false,
          isOnCited: true,
          isAboveRef: false,
        }));
      }
    } else if (this.refTabWrapper && this.citedTabWrapper) {
      const refOffsetBottom = this.refTabWrapper.offsetTop;
      const citedOffsetTop = this.citedTabWrapper.offsetTop;
      const currentScrollTop = scrollTop + NAVBAR_HEIGHT;

      if (!this.state.isAboveRef && currentScrollTop < refOffsetBottom) {
        this.setState(prevState => ({ ...prevState, isAboveRef: true, isOnCited: false, isOnRef: false }));
      } else if (!this.state.isOnRef && currentScrollTop >= refOffsetBottom && currentScrollTop < citedOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isAboveRef: false,
          isOnCited: false,
          isOnRef: true,
        }));
      } else if (!this.state.isOnCited && currentScrollTop >= citedOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isAboveRef: false,
          isOnCited: true,
          isOnRef: false,
        }));
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

  private scrollToSection = (section: "fullText" | "ref" | "cited") => () => {
    let target: HTMLDivElement | null = null;
    let action: string = "";
    let label: string = "";

    switch (section) {
      case "fullText": {
        target = this.fullTextTabWrapper;
        label = "Click Full text Tab";
        action = "Click Full text Tab in Paper Show refBar";
        break;
      }

      case "ref": {
        target = this.refTabWrapper;
        label = "Click References Tab";
        action = "Click References Tab in Paper Show refBar";
        break;
      }

      case "cited": {
        target = this.citedTabWrapper;
        label = "Click Cited by Tab";
        action = "Click Cited by Tab in Paper Show refBar";
        break;
      }
    }

    if (!EnvChecker.isOnServer() && target) {
      window.scrollTo(0, target.offsetTop - NAVBAR_HEIGHT);
      trackEvent({
        category: "New Paper Show",
        action,
        label,
      });
    }
  };

  private buildPageDescription = () => {
    const { paper } = this.props;
    if (paper) {
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
    }
  };

  private makeStructuredData = (paper: Paper) => {
    const authorsForStructuredData = paper.authors.map(author => {
      if (author) {
        const affiliationName = author.organization || (author.affiliation && author.affiliation.name);

        return {
          "@type": "Person",
          name: author.name,
          affiliation: {
            name: affiliationName || "",
          },
        };
      }
      return null;
    });

    function getPublisher() {
      if (paper.journal) {
        return {
          "@type": ["PublicationVolume", "Periodical"],
          name: paper.journal.title,
          publisher: paper.journal.title,
          contentRating: {
            "@type": "Rating",
            name: "impact factor",
            ratingValue: paper.journal.impactFactor || 0,
          },
        };
      }
      return null;
    }

    const structuredData: any = {
      "@context": "http://schema.org",
      "@type": "ScholarlyArticle",
      headline: paper.title,
      identifier: paper.doi,
      description: paper.abstract,
      name: paper.title,
      image: ["https://assets.pluto.network/scinapse/scinapse-logo.png"],
      datePublished: paper.publishedDate,
      dateModified: paper.publishedDate,
      author: authorsForStructuredData,
      about: paper.fosList.map(fos => fos!.fos),
      mainEntityOfPage: `https://scinapse.io/papers/${paper.id}`,
      publisher: getPublisher(),
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
          <link rel="canonical" href={`https://scinapse.io/papers/${paper.id}`} />
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
