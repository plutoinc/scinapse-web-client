import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import * as classNames from "classnames";
import { Helmet } from "react-helmet";
import { stringify } from "qs";
import { denormalize } from "normalizr";
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
import PaperShowActionBar from "../paperShowActionBar";
import FOSList from "../../components/paperShow/components/fosList";
import PdfSourceButton from "../../components/paperShow/components/pdfSourceButton";
import ReferencePapers from "../../components/paperShow/components/relatedPapers";
import SearchKeyword from "../../components/paperShow/components/searchKeyword";
import { Footer } from "../../components/layouts";
import { Configuration } from "../../reducers/configuration";
import { paperSchema, Paper } from "../../model/paper";
import { fetchPaperShowData, fetchRefPaperData, fetchCitedPaperData } from "./sideEffect";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
// import CollectionList from "../../components/paperShow/components/collectionList";
import { LayoutState, UserDevice } from "../../components/layouts/records";
import { PaperInCollection, paperInCollectionSchema } from "../../model/paperInCollection";
import FailedToLoadPaper from "../../components/paperShow/failedToLoadPaper";
const styles = require("./paperShow.scss");

const sideNavigationMarginTop = parseInt(styles.sideNavMarginTop, 10);

let ticking = false;

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
    paperShow: state.paperShow,
    configuration: state.configuration,
    paper: denormalize(state.paperShow.paperId, paperSchema, state.entities),
    papersInCollection: denormalize(state.collectionShow.paperIds, [paperInCollectionSchema], state.entities),
    referencePapers: denormalize(state.paperShow.referencePaperIds, [paperSchema], state.entities),
    citedPapers: denormalize(state.paperShow.citedPaperIds, [paperSchema], state.entities),
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
  paper: Paper;
  papersInCollection: PaperInCollection[];
  referencePapers: Paper[];
  citedPapers: Paper[];
}

interface PaperShowStates
  extends Readonly<{
      isActionBarFixed: boolean;
      isStickOtherPapers: boolean;
      isStickNav: boolean;
      isOnReferencesPart: boolean;
      isFooterBottom: boolean;
      isOnCitedPart: boolean;
      papersInCollection: any;
    }> {}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, PaperShowStates> {
  private actionBarWrapper: HTMLDivElement | null;
  private actionBarFallback: HTMLDivElement | null;
  private otherPapersElement: HTMLDivElement | null;
  private containerElement: HTMLDivElement | null;
  private sideNavigationElement: HTMLElement | null;
  private referencePapersWrapper: HTMLLIElement | null;
  private citedPapersWrapper: HTMLLIElement | null;
  private footerDivElement: HTMLDivElement | null;

  constructor(props: PaperShowProps) {
    super(props);

    this.state = {
      isActionBarFixed: false,
      isStickOtherPapers: false,
      isStickNav: false,
      isFooterBottom: false,
      isOnReferencesPart: true,
      isOnCitedPart: false,
      papersInCollection: [],
    };
  }

  public async componentDidMount() {
    const { configuration, currentUser, dispatch, match, location } = this.props;
    const notRenderedAtServerOrJSAlreadyInitialized = !configuration.initialFetched || configuration.clientJSRendered;

    window.addEventListener("scroll", this.handleScroll, { passive: true });

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      const queryParams: PaperShowPageQueryParams = getQueryParamsObject(location.search);

      await fetchPaperShowData(
        {
          dispatch,
          match,
          pathname: location.pathname,
          queryParams,
        },
        currentUser
      );

      this.scrollToRelatedPapersNode();
    }

    this.handleScrollEvent();
  }

  public async componentDidUpdate(prevProps: PaperShowProps) {
    const { dispatch, match, location, currentUser, paper } = this.props;
    const prevQueryParams: PaperShowPageQueryParams = getQueryParamsObject(prevProps.location.search);
    const queryParams: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    const movedToDifferentPaper = match.params.paperId !== prevProps.match.params.paperId;
    const changeInRefPage = prevQueryParams["ref-page"] !== queryParams["ref-page"];
    const changeInCitedPage = prevQueryParams["cited-page"] !== queryParams["cited-page"];
    if (movedToDifferentPaper) {
      await fetchPaperShowData(
        {
          dispatch,
          match,
          pathname: location.pathname,
          queryParams,
        },
        currentUser
      );
      this.scrollToRelatedPapersNode();
    }

    if (paper && changeInRefPage) {
      dispatch(fetchRefPaperData(paper.id, queryParams["ref-page"]));
    }

    if (paper && changeInCitedPage) {
      dispatch(fetchCitedPaperData(paper.id, queryParams["cited-page"]));
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(clearPaperShowState());
    window.removeEventListener("scroll", this.handleScroll);
  }

  public render() {
    const { layout, paperShow, location, currentUser, paper, referencePapers, citedPapers } = this.props;
    const { isActionBarFixed } = this.state;

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
      <div className={styles.container} ref={el => (this.containerElement = el)}>
        {this.getPageHelmet()}
        <article className={styles.paperShow}>
          <div className={styles.paperTitle}>{paper.title}</div>
          <div className={styles.paperContentBlockDivider} />
          <div className={styles.paperInfo}>
            <AuthorList layout={layout} authors={paper.authors} />
            <PaperShowJournalItem paper={paper} />
            {paper.doi && <PaperShowDOI DOI={paper.doi} />}
          </div>
          <div className={styles.paperContentBlockDivider} />
          <div className={styles.paperContent}>
            <div className={styles.abstract}>
              <div className={styles.paperContentBlockHeader}>
                Abstract
                <PdfSourceButton wrapperStyle={{ marginRight: "0px" }} paper={paper} />
              </div>
            </div>
            <div className={styles.abstractContent}>{paper.abstract}</div>
            <div className={styles.fos}>
              <FOSList FOSList={paper.fosList} />
            </div>
          </div>
          <div className={styles.paperContentBlockDivider} />

          <div
            className={classNames({
              [styles.actionBarWrapper]: !isActionBarFixed,
              [styles.fixedActionBarWrapper]: isActionBarFixed,
            })}
            ref={el => (this.actionBarWrapper = el)}
          >
            <PaperShowActionBar />
          </div>
          {isActionBarFixed && (
            <div
              className={classNames({
                [styles.actionBarFallback]: isActionBarFixed,
              })}
              ref={el => (this.actionBarFallback = el)}
            />
          )}

          <div className={styles.paperContentBlockDivider} />
          <div className={styles.otherPapers} ref={el => (this.otherPapersElement = el)}>
            <div className={styles.references}>
              <div style={this.state.isStickOtherPapers ? { height: "69px" } : { height: "0px" }} />
              <div
                className={classNames({
                  [`${styles.paperContentBlockHeaderTabs}`]: !this.state.isStickOtherPapers,
                  [`${styles.paperContentBlockHeaderTabs} ${styles.stick}`]: this.state.isStickOtherPapers,
                })}
              >
                <ul className={styles.headerTabList}>
                  <li
                    ref={el => (this.referencePapersWrapper = el)}
                    className={classNames({
                      [`${styles.headerTabItem}`]: true,
                      [`${styles.active}`]: this.state.isOnReferencesPart,
                    })}
                    onClick={this.scrollToReferencePapersNode}
                  >
                    {`REFERENCES (${paper.referenceCount})`}
                  </li>
                  <li
                    className={classNames({
                      [`${styles.headerTabItem}`]: true,
                      [`${styles.active}`]: this.state.isOnCitedPart,
                    })}
                    onClick={this.scrollToCitedPapersNode}
                  >
                    {`CITED BY (${paper.citedCount})`}
                  </li>
                </ul>
                <div className={styles.scrollTop}>
                  <button className={styles.scrollButton} onClick={this.scrollToTop}>
                    ↑ Top
                  </button>
                </div>
              </div>
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
            <div className={styles.citedby}>
              <div className={styles.paperContentBlockHeaderTabs}>
                <ul className={styles.headerTabList}>
                  <li className={styles.headerTabItem} onClick={this.scrollToReferencePapersNode}>
                    {`REFERENCES (${paper.referenceCount})`}
                  </li>
                  <li
                    ref={el => (this.citedPapersWrapper = el)}
                    className={classNames({
                      [`${styles.headerTabItem}`]: true,
                      [`${styles.active}`]: true,
                    })}
                    onClick={this.scrollToCitedPapersNode}
                  >
                    {`CITED BY (${paper.citedCount})`}
                  </li>
                </ul>
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
          <div ref={el => (this.footerDivElement = el)}>
            <Footer />
          </div>
        </article>
        <nav
          ref={el => (this.sideNavigationElement = el)}
          className={classNames({
            [`${styles.sideNavigation}`]: !this.state.isStickNav,
            [`${styles.sideNavigation} ${styles.stick}`]: this.state.isStickNav,
            [`${styles.footerStick} `]: this.state.isFooterBottom,
          })}
        >
          {/* {this.state.papersInCollection.length > 0 && (
            <CollectionList myCollections={myCollections} papersInCollection={this.state.papersInCollection} />
          )} */}
          <RelatedPaperList />
          <SearchKeyword FOSList={paper.fosList} />
        </nav>
      </div>
    );
  }

  private restorationScroll = () => {
    window.scrollTo(0, 0);
  };

  private handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(this.handleScrollEvent);
    }
    ticking = true;
  };

  private handleScrollEvent = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const viewportHeight = window.innerHeight;
    const windowBottom = scrollTop + viewportHeight;
    const scrollBottom = windowBottom + scrollTop;

    const otherPapersTop = this.otherPapersElement && this.otherPapersElement.offsetTop;
    const sideNaviTop = (this.containerElement && this.containerElement.offsetTop + sideNavigationMarginTop) || 0;
    const sideNaviHeight =
      (this.sideNavigationElement && this.sideNavigationElement.getBoundingClientRect().height) || 0;
    const sideNaviBottom = sideNaviTop + sideNaviHeight;
    const footerDivHeight = (this.footerDivElement && this.footerDivElement.getBoundingClientRect().height) || 0;
    const footerDivOffsetTop = (this.footerDivElement && this.footerDivElement.offsetTop) || 0;

    const referencePapersWrapperTop =
      (this.referencePapersWrapper &&
        Math.floor(this.referencePapersWrapper.getBoundingClientRect().top + scrollY - 72)) ||
      0;
    const citedPapersWrapperTop =
      (this.citedPapersWrapper && Math.floor(this.citedPapersWrapper.getBoundingClientRect().top + scrollY - 72)) || 0;

    // action bar
    if (this.actionBarWrapper && !this.state.isActionBarFixed) {
      const absoluteActionBarTop = this.actionBarWrapper.offsetTop || 0;

      if (absoluteActionBarTop && viewportHeight < absoluteActionBarTop && scrollBottom < absoluteActionBarTop) {
        console.log("FIRE! YOU ARE GONNA BE THE FIX!");
        this.setState(prevState => ({ ...prevState, isActionBarFixed: true }));
      }
    } else if (this.actionBarFallback && this.state.isActionBarFixed) {
      console.log(
        "scrollBottom: ",
        scrollBottom,
        "fallbackBottom: ",
        this.actionBarFallback.offsetTop + this.actionBarFallback.clientHeight
      );
      const actionBarFallbackBottom = this.actionBarFallback.offsetTop + this.actionBarFallback.clientHeight;

      if (scrollBottom >= actionBarFallbackBottom) {
        console.log("FIRE! YOU ARE GONNA BE THE STATIC!");
        this.setState(prevState => ({ ...prevState, isActionBarFixed: false }));
      }
    }

    // footer
    if (sideNaviHeight > viewportHeight - (footerDivHeight + 72) && windowBottom > footerDivOffsetTop + 72) {
      this.setState({
        isFooterBottom: true,
      });
    } else {
      this.setState({
        isFooterBottom: false,
      });
    }
    // sideNav
    if (windowBottom > sideNaviBottom + 24 && windowBottom !== viewportHeight) {
      this.setState({
        isStickNav: true,
      });
    } else {
      this.setState({
        isStickNav: false,
      });
    }
    // other paper
    if (scrollTop + 60 + 14 > (otherPapersTop || 0) && !this.state.isStickOtherPapers) {
      this.setState({
        isStickOtherPapers: true,
      });
    } else if (scrollTop + 60 + 14 <= (otherPapersTop || 0) && this.state.isStickOtherPapers) {
      this.setState({
        isStickOtherPapers: false,
      });
    }
    ticking = false;
    // other paper
    if (scrollTop <= referencePapersWrapperTop && scrollTop < citedPapersWrapperTop) {
      ticking = false;
      return this.setState({
        isOnReferencesPart: true,
        isOnCitedPart: false,
      });
    } else {
      ticking = false;
      return this.setState({
        isOnReferencesPart: false,
        isOnCitedPart: true,
      });
    }
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

  private scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  private scrollToCitedPapersNode = () => {
    const targetHeight =
      (this.citedPapersWrapper && this.citedPapersWrapper.getBoundingClientRect().top + window.scrollY - 72) || 0;
    window.scrollTo(0, targetHeight);
  };

  private scrollToReferencePapersNode = () => {
    const targetHeight = (this.otherPapersElement && this.otherPapersElement.offsetTop - 72) || 0;
    window.scrollTo(0, targetHeight);
  };

  private scrollToRelatedPapersNode = () => {
    const { location } = this.props;

    if (location.hash === "#cited") {
      this.scrollToCitedPapersNode();
    } else if (location.hash === "#references") {
      this.scrollToReferencePapersNode();
    } else {
      this.restorationScroll();
    }
  };

  // private getMyCollections = async () => {
  //   const { dispatch, currentUser, paper } = this.props;

  //   if (checkAuth(AUTH_LEVEL.UNVERIFIED)) {
  //     this.setState({ papersInCollection: [] });

  //     if (currentUser.isLoggedIn && paper) {
  //       try {
  //         const collectionResponse = await dispatch(getMyCollections(paper.id));

  //         if (collectionResponse && collectionResponse.result.length > 0) {
  //           collectionResponse.content.filter(obj => obj.contains_selected).map(async collection => {
  //             const response = await dispatch(getPapers(collection.id));

  //             if (response && response.result.length > 0) {
  //               this.setState({
  //                 papersInCollection: [
  //                   ...this.state.papersInCollection,
  //                   response.entities.papersInCollection[paper.id],
  //                 ],
  //               });
  //             }
  //           });
  //         }
  //       } catch (err) {
  //         console.error(`Error for fetching paper show page data`, err);
  //       }
  //     }
  //   }
  // };

  private buildPageDescription = () => {
    const { paper } = this.props;

    if (!paper) {
      return "sci-napse";
    }
    const shortAbstract = paper.abstract ? `${paper.abstract.slice(0, 50)} | ` : "";
    const shortAuthors =
      paper.authors && paper.authors.length > 0
        ? `${paper.authors
            .map(author => {
              return author!.name;
            })
            .join(", ")
            .slice(0, 50)}  | `
        : "";
    const shortJournals = paper.journal ? `${paper.journal!.fullTitle!.slice(0, 50)} | ` : "";

    return `${shortAbstract}${shortAuthors}${shortJournals} | sci-napse`;
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

    const structuredData: any = {
      "@context": "http://schema.org",
      "@type": "Article",
      headline: paper.title,
      image: [],
      datePublished: paper.year,
      author: authorsForStructuredData,
      keywords: paper.fosList.map(fos => fos!.fos),
      description: paper.abstract,
      mainEntityOfPage: "https://scinapse.io",
    };

    return structuredData;
  };

  private getPageHelmet = () => {
    const { paper } = this.props;

    if (paper) {
      return (
        <Helmet>
          <title>{paper.title} | Sci-napse | Academic search engine for paper</title>
          <meta itemProp="name" content={`${paper.title} | Sci-napse | Academic search engine for paper`} />
          <meta name="description" content={this.buildPageDescription()} />
          <meta name="twitter:description" content={this.buildPageDescription()} />
          <meta name="twitter:card" content={`${paper.title} | Sci-napse | Academic search engine for paper`} />
          <meta name="twitter:title" content={`${paper.title} | Sci-napse | Academic search engine for paper`} />
          <meta property="og:title" content={`${paper.title} | Sci-napse | Academic search engine for paper`} />
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
