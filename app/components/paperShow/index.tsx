import * as React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import * as classNames from "classnames";
import { Helmet } from "react-helmet";
import { stringify } from "qs";
import Popover from "@material-ui/core/Popover/Popover";
import { denormalize } from "normalizr";
import { getPapers } from "../collectionShow/actions";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import ArticleSpinner from "../common/spinner/articleSpinner";
import { getMyCollections, clearPaperShowState, postNewCollection } from "./actions";
import CollectionList from "./components/collectionList";
import { PaperShowState } from "./records";
import AuthorList from "./components/authorList";
import RelatedPaperList from "./components/relatedPaperList";
import FOSList from "./components/fosList";
import CollectionDropdown from "./components/collectionDropdown";
import PdfSourceButton from "./components/pdfSourceButton";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { addPaperToCollection, removePaperFromCollection } from "../dialog/actions"; //openVerificationNeeded,
import ReferencePapers from "./components/relatedPapers";
import SearchKeyword from "./components/searchKeyword";
import { Footer } from "../layouts";
import { Comment, commentSchema } from "../../model/comment";
import { Configuration } from "../../reducers/configuration";
import { paperSchema, Paper } from "../../model/paper";
import { fetchPaperShowData, fetchRefPaperData, fetchCitedPaperData } from "./sideEffect";
import copySelectedTextToClipboard from "../../helpers/copySelectedTextToClipboard";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import { collectionSchema, Collection } from "../../model/collection";
import { PostCollectionParams } from "../../api/collection";
import GlobalDialogManager from "../../helpers/globalDialogManager";
import { LayoutState, UserDevice } from "../layouts/records";
import { PaperInCollection, paperInCollectionSchema } from "../../model/paperInCollection";
import { trackEvent } from "../../helpers/handleGA";
const styles = require("./paperShow.scss");
import Icon from "../../icons";

const sideNavigationMarginTop = parseInt(styles.sideNavMarginTop, 10);

let ticking = false;

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
    paperShow: state.paperShow,
    configuration: state.configuration,
    paper: denormalize(state.paperShow.paperId, paperSchema, state.entities),
    myCollections: denormalize(state.paperShow.myCollectionIds, [collectionSchema], state.entities),
    papersInCollection: denormalize(state.collectionShow.paperIds, [paperInCollectionSchema], state.entities),
    relatedPapers: denormalize(state.paperShow.relatedPaperIds, [paperSchema], state.entities),
    otherPapers: denormalize(state.paperShow.otherPaperIds, [paperSchema], state.entities),
    referencePapers: denormalize(state.paperShow.referencePaperIds, [paperSchema], state.entities),
    citedPapers: denormalize(state.paperShow.citedPaperIds, [paperSchema], state.entities),
    comments: denormalize(state.paperShow.commentIds, [commentSchema], state.entities),
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
  myCollections: Collection[];
  papersInCollection: PaperInCollection[];
  relatedPapers: Paper[];
  otherPapers: Paper[];
  referencePapers: Paper[];
  citedPapers: Paper[];
  comments: Comment[];
}

interface PaperShowStates
  extends Readonly<{
      isStickOtherPapers: boolean;
      isStickNav: boolean;
      isOnReferencesPart: boolean;
      isFooterBottom: boolean;
      isOnCitedPart: boolean;
      isCollectionDropdownOpen: boolean;
      papersInCollection: any;
    }> {}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, PaperShowStates> {
  private otherPapersElement: HTMLDivElement | null;
  private containerElement: HTMLDivElement | null;
  private sideNavigationElement: HTMLElement | null;
  private referencePapersWrapper: HTMLLIElement | null;
  private citedPapersWrapper: HTMLLIElement | null;
  private collectionDivElement: HTMLDivElement | null;
  private footerDivElement: HTMLDivElement | null;

  constructor(props: PaperShowProps) {
    super(props);

    this.state = {
      isCollectionDropdownOpen: false,
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
    this.getMyCollections();
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
    const {
      layout,
      paperShow,
      location,
      currentUser,
      paper,
      relatedPapers,
      myCollections,
      // otherPapers,
      referencePapers,
      citedPapers,
      // comments,
    } = this.props;

    if (paperShow.isLoadingPaper) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    }

    if (paperShow.hasErrorOnFetchingPaper) {
      return (
        <div className={styles.failedPage}>
          <div className={styles.failedContentWrapper}>
            <h1>Sorry, Failed to load the paper.</h1>
            <Link to="/">Go to Home</Link>
          </div>
        </div>
      );
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
            <div className={styles.published}>
              <div className={styles.paperContentBlockHeader}>Published</div>
              {this.getJournalInformationNode()}
            </div>
            <div className={styles.doi}>
              <div className={styles.paperContentBlockHeader}>
                DOI
                {paper.doi ? (
                  <button className={styles.tinyButton} onClick={this.clickDOIButton}>
                    <Icon icon="COPY_DOI" />
                    <span>Copy DOI</span>
                  </button>
                ) : null}
              </div>
              {this.getDOIButton()}
            </div>
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
          <div className={styles.actionBarPosition}>
            <div className={`${styles.actionBar} `}>
              <ul className={styles.actions}>
                <div className={styles.leftSide} />
                <div className={styles.rightSide}>
                  <li className={styles.actionItem}>{this.getCitationBox()}</li>
                  <li className={styles.actionItem}>
                    <div
                      onClick={this.handleRequestToOpenCollectionDropdown}
                      className={styles.actionSave}
                      ref={el => (this.collectionDivElement = el)}
                    >
                      <Icon icon={"BOOKMARK_GRAY"} />
                      <span>Save to Collection</span>
                    </div>
                    {this.getCollectionPopover()}
                  </li>
                </div>
              </ul>
            </div>
          </div>
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
          {this.state.papersInCollection.length > 0 ? (
            <CollectionList myCollections={myCollections} papersInCollection={this.state.papersInCollection} />
          ) : null}
          {relatedPapers ? <RelatedPaperList paperList={relatedPapers} /> : null}
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
    const windowInnerHeight = window.innerHeight;
    const windowBotton = scrollTop + windowInnerHeight;
    const otherPapersTop = this.otherPapersElement && this.otherPapersElement.offsetTop;
    const sideNaviTop = (this.containerElement && this.containerElement.offsetTop + sideNavigationMarginTop) || 0;
    const sideNaviHeight =
      (this.sideNavigationElement && this.sideNavigationElement.getBoundingClientRect().height) || 0;
    const sideNaviBottom = sideNaviTop + sideNaviHeight;
    const footerDivHeight = (this.footerDivElement && this.footerDivElement.getBoundingClientRect().height) || 0;
    const footerDivOffsetTop = (this.footerDivElement && this.footerDivElement.offsetTop) || 0;

    const referencePapersWrapperTop =
      (this.referencePapersWrapper &&
        Math.floor(this.referencePapersWrapper.getBoundingClientRect().top + window.scrollY - 72)) ||
      0;
    const citedPapersWrapperTop =
      (this.citedPapersWrapper &&
        Math.floor(this.citedPapersWrapper.getBoundingClientRect().top + window.scrollY - 72)) ||
      0;
    // footer
    if (sideNaviHeight > windowInnerHeight - (footerDivHeight + 72) && windowBotton > footerDivOffsetTop + 72) {
      ticking = false;
      this.setState({
        isFooterBottom: true,
      });
    } else {
      ticking = false;
      this.setState({
        isFooterBottom: false,
      });
    }
    //sideNav
    if (windowBotton > sideNaviBottom + 24 && windowBotton != windowInnerHeight) {
      ticking = false;
      this.setState({
        isStickNav: true,
      });
    } else {
      ticking = false;
      this.setState({
        isStickNav: false,
      });
    }
    //other paper
    if (scrollTop + 60 + 14 > (otherPapersTop || 0) && !this.state.isStickOtherPapers) {
      ticking = false;
      this.setState({
        isStickOtherPapers: true,
      });
    } else if (scrollTop + 60 + 14 <= (otherPapersTop || 0) && this.state.isStickOtherPapers) {
      ticking = false;
      this.setState({
        isStickOtherPapers: false,
      });
    }
    //other paper
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
  private handleRequestToOpenCollectionDropdown = () => {
    const { currentUser } = this.props;

    trackEvent({ category: "Additional Action", action: "Click [Add Collection] Button" });

    if (!currentUser.isLoggedIn) {
      return GlobalDialogManager.openSignUpDialog();
    } else if (currentUser.isLoggedIn) {
      this.setState({
        isCollectionDropdownOpen: true,
      });
    }
  };

  private handleRequestToCloseCollectionDropdown = () => {
    this.setState({
      isCollectionDropdownOpen: false,
    });
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

  private getCitationBox = () => {
    const { paper } = this.props;

    if (paper && paper.id) {
      return (
        <div>
          <div
            onClick={() => {
              GlobalDialogManager.openCitationDialog(paper.id);
              trackEvent({ category: "Additional Action", action: "Click Citation Button" });
            }}
            className={styles.actionCite}
          >
            <div>
              <Icon icon={"CITATION_QUOTE"} />
              <span>Cite this paper</span>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  private getDOIButton = () => {
    const { paper } = this.props;

    if (paper && paper.doi) {
      return <ul className={styles.doiContent}>{paper.doi}</ul>;
    } else {
      return null;
    }
  };
  private getCollectionPopover = () => {
    const { paperShow, myCollections } = this.props;

    return (
      <Popover
        open={this.state.isCollectionDropdownOpen}
        anchorEl={this.collectionDivElement!}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={this.handleRequestToCloseCollectionDropdown}
        classes={{
          paper: styles.collectionDropdownPaper,
        }}
      >
        <CollectionDropdown
          isLoadingMyCollections={paperShow.isLoadingMyCollections}
          isPositingNewCollection={paperShow.isPositingNewCollection}
          myCollections={myCollections}
          getMyCollections={this.getMyCollections}
          handleAddingPaperToCollection={this.handleAddingPaperToCollection}
          handleRemovingPaperFromCollection={this.handleRemovingPaperFromCollection}
          handleSubmitNewCollection={this.handleSubmitNewCollection}
        />
      </Popover>
    );
  };
  private getMyCollections = async () => {
    const { dispatch, currentUser, paper } = this.props;
    checkAuthDialog();
    this.setState({ papersInCollection: [] });
    if (currentUser.isLoggedIn && paper) {
      try {
        const collectionResponse = await dispatch(getMyCollections(paper.id));
        if (collectionResponse && collectionResponse.result.length > 0) {
          collectionResponse.content.filter(obj => obj.contains_selected).map(async collection => {
            const response = await dispatch(getPapers(collection.id));
            if (response && response.result.length > 0) {
              this.setState({
                papersInCollection: [...this.state.papersInCollection, response.entities.papersInCollection[paper.id]],
              });
            }
          });
        }
      } catch (err) {
        console.error(`Error for fetching paper show page data`, err);
      }
    }
  };

  private handleAddingPaperToCollection = async (collection: Collection) => {
    const { dispatch, paper } = this.props;

    await dispatch(
      addPaperToCollection({
        collection,
        paperId: paper.id,
      })
    );
    await this.getMyCollections();
  };

  private handleRemovingPaperFromCollection = async (collection: Collection) => {
    const { dispatch, paper } = this.props;

    await dispatch(
      removePaperFromCollection({
        collection,
        paperIds: [paper.id],
      })
    );
    await this.getMyCollections();
  };

  private handleSubmitNewCollection = async (params: PostCollectionParams) => {
    const { dispatch } = this.props;
    await dispatch(postNewCollection(params));
  };

  private clickDOIButton = () => {
    const { paper } = this.props;

    if (paper.doi) {
      copySelectedTextToClipboard(`https://doi.org/${paper.doi}`);
      trackEvent({ category: "Additional Action", action: "Copy DOI" });
    }
  };

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

  private getJournalInformationNode = () => {
    const { paper } = this.props;
    if (!paper || !paper.year) {
      return null;
    } else {
      const { journal } = paper;
      return (
        <ul className={styles.journalList}>
          {journal ? (
            <li className={styles.journalItem}>
              <Link
                to={`/journals/${journal.id}`}
                onClick={() => {
                  trackEvent({ category: "Search", action: "Click Journal", label: "" });
                }}
              >
                <div className={styles.journalTitle}>{`${journal.fullTitle || paper.venue}`}</div>
                <div className={styles.journalYear}>{paper.year}</div>
                <div className={styles.journalIF}>
                  {journal.impactFactor ? ` Impact Factor: ${journal.impactFactor.toFixed(2)}` : ""}
                </div>
              </Link>
            </li>
          ) : (
            <li className={styles.journalItem}>
              <div className={styles.journalYear}>{paper.year}</div>
            </li>
          )}
        </ul>
      );
    }
  };
}

export default connect(mapStateToProps)(withRouter(PaperShow));
