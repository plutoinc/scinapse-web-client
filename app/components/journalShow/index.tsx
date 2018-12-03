import * as React from "react";
import axios from "axios";
import { parse, stringify } from "qs";
import { connect, Dispatch } from "react-redux";
import { push } from "connected-react-router";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { denormalize } from "normalizr";
import { Helmet } from "react-helmet";
import { AppState } from "../../reducers";
import PaperItem from "../common/paperItem";
import MobilePagination from "../common/mobilePagination";
import DesktopPagination from "../common/desktopPagination";
import ArticleSpinner from "../common/spinner/articleSpinner";
import ScinapseInput from "../common/scinapseInput";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import { Configuration } from "../../reducers/configuration";
import { fetchJournalShowPageData, JournalShowQueryParams } from "./sideEffect";
import { paperSchema, Paper } from "../../model/paper";
import { journalSchema, Journal } from "../../model/journal";
import { JournalShowState } from "./reducer";
import Footer from "../layouts/footer";
import Icon from "../../icons";
import { LayoutState, UserDevice } from "../layouts/records";
import formatNumber from "../../helpers/formatNumber";
import SortBox, { PAPER_LIST_SORT_TYPES } from "../common/sortBox";
import SafeURIStringHandler from "../../helpers/safeURIStringHandler";
import PaperShowKeyword from "../paperShow/components/keyword";
const styles = require("./journalShow.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
    configuration: state.configuration,
    journalShow: state.journalShow,
    journal: denormalize(state.journalShow.journalId, journalSchema, state.entities),
    papers: denormalize(state.journalShow.paperIds, [paperSchema], state.entities),
  };
}

export interface JournalShowMatchParams {
  journalId: string;
}

export interface JournalShowProps
  extends RouteComponentProps<JournalShowMatchParams>,
    Readonly<{
      layout: LayoutState;
      currentUser: CurrentUser;
      configuration: Configuration;
      journalShow: JournalShowState;
      journal: Journal | undefined;
      papers: Paper[] | undefined;
      dispatch: Dispatch<any>;
    }> {}

@withStyles<typeof JournalShowContainer>(styles)
class JournalShowContainer extends React.PureComponent<JournalShowProps> {
  private cancelToken = axios.CancelToken.source();

  public componentDidMount() {
    const { dispatch, match, configuration, location, journalShow } = this.props;

    const notRenderedAtServerOrJSAlreadyInitialized = !configuration.initialFetched || configuration.clientJSRendered;
    const alreadyFetchedData = journalShow.journalId.toString() === match.params.journalId;

    if (notRenderedAtServerOrJSAlreadyInitialized && !alreadyFetchedData) {
      fetchJournalShowPageData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: location.search,
        cancelToken: this.cancelToken.token,
      });
    }
  }

  public componentWillReceiveProps(nextProps: JournalShowProps) {
    const { dispatch, match, location } = nextProps;
    const currentJournalId = this.props.match.params.journalId;
    const nextJournalId = match.params.journalId;

    if (currentJournalId !== nextJournalId || this.props.location.search !== location.search) {
      fetchJournalShowPageData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: location.search,
        cancelToken: this.cancelToken.token,
      });
    }
    this.restoreScroll();
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { journalShow, journal } = this.props;

    if (journalShow.isLoadingJournal) {
      return (
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
          </div>
        </div>
      );
    } else if (journal) {
      return (
        <div className={styles.journalShowWrapper}>
          {this.getPageHelmet()}
          <div className={styles.headSection}>
            <div className={styles.container}>
              <div className={styles.leftBox}>
                <div className={styles.title}>
                  <Link to={`/journals/${journal.id}`}>{journal.fullTitle}</Link>
                  {this.getExternalLink()}
                </div>
                <div className={styles.infoWrapper}>
                  {journal.impactFactor ? (
                    <span>
                      <div className={styles.subtitle}>IF</div>
                      <strong>{journal.impactFactor}</strong>
                    </span>
                  ) : null}
                  <span>
                    <div className={styles.subtitle}>Papers</div>
                    <strong>{journal.paperCount}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.paperListContainer}>
            <div className={styles.container}>
              <div className={styles.leftBox}>
                <div className={styles.paperListBox}>
                  <div className={styles.header}>
                    <div className={styles.listTitle}>
                      <span>{`Papers `}</span>
                      <span className={styles.paperCount}>{journalShow.filteredPaperCount}</span>
                    </div>
                    <div className={styles.searchInputWrapper}>
                      <ScinapseInput
                        onSubmit={this.handleSubmitSearch}
                        placeholder="Search papers in this journal"
                        icon="SEARCH_ICON"
                      />
                    </div>
                  </div>
                  <div className={styles.subHeader}>
                    <div className={styles.resultPaperCount}>{`${journalShow.paperCurrentPage} page of ${formatNumber(
                      journalShow.paperTotalPage
                    )} pages (${formatNumber(journalShow.totalPaperCount)} results)`}</div>
                    <div className={styles.sortBoxWrapper}>{this.getSortBox()}</div>
                  </div>
                  <div>{this.getPaperList()}</div>
                  <div>{this.getPagination()}</div>
                </div>
              </div>
              <div className={styles.rightBox}>
                <div className={styles.fosSection}>
                  <div className={styles.topFosTitle}>Top fields of study</div>
                  <div className={styles.fosWrapper}>{this.getTopFOSList()}</div>
                </div>
              </div>
            </div>
          </div>
          <Footer containerStyle={{ backgroundColor: "white" }} />
        </div>
      );
    } else {
      return null;
    }
  }

  private getTopFOSList = () => {
    const { journal } = this.props;

    if (journal && journal.fosList && journal.fosList.length > 0) {
      return journal.fosList.map(fos => (
        <PaperShowKeyword key={fos.id} fos={fos}>
          {fos.name}
        </PaperShowKeyword>
      ));
    }

    return null;
  };

  private getExternalLink = () => {
    const { journal } = this.props;

    if (journal && journal.webPage) {
      return (
        <a href={journal.webPage} target="_blank" className={styles.externalIconWrapper}>
          <Icon icon="EXTERNAL_SOURCE" />
        </a>
      );
    }
    return null;
  };

  private getSortBox = () => {
    const queryParams = this.getQueryParamsObject();
    const shouldExposeRelevanceOption = !!queryParams.q;
    const sortOption = queryParams.s || "NEWEST_FIRST";

    return (
      <SortBox
        handleClickSortOption={this.handleSortOptionChange}
        sortOption={sortOption}
        exposeRelevanceOption={shouldExposeRelevanceOption}
      />
    );
  };

  private handleSortOptionChange = (sortOption: PAPER_LIST_SORT_TYPES) => {
    const { dispatch, journalShow } = this.props;

    const currentQueryParams = this.getQueryParamsObject();
    const nextQueryParams = { ...currentQueryParams, s: sortOption };

    dispatch(
      push({
        pathname: `/journals/${journalShow.journalId}`,
        search: stringify(nextQueryParams, { addQueryPrefix: true }),
      })
    );
  };

  private getQueryParamsObject = () => {
    const { location } = this.props;
    const currentQueryParams: JournalShowQueryParams = parse(location.search, { ignoreQueryPrefix: true });
    return currentQueryParams;
  };

  private getPageHelmet = () => {
    const { journal } = this.props;

    if (journal) {
      return (
        <Helmet>
          <title>{journal.fullTitle} | Sci-napse</title>
          <meta itemProp="name" content={`${journal.fullTitle} | Sci-napse`} />
          {/* tslint:disable-next-line:max-line-length */}
          <meta
            name="description"
            content={`${journal.fullTitle} | IF: ${journal.impactFactor} | ${journal.paperCount} papers`}
          />
          {/* tslint:disable-next-line:max-line-length */}
          <meta
            name="twitter:description"
            content={`${journal.fullTitle} | IF: ${journal.impactFactor} | ${journal.paperCount} papers`}
          />
          <meta name="twitter:card" content={`${journal.fullTitle} | Sci-napse`} />
          <meta name="twitter:title" content={`${journal.fullTitle} | Sci-napse`} />
          <meta property="og:title" content={`${journal.fullTitle} | Sci-napse`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://scinapse.io/journals/${journal.id}`} />
          {/* tslint:disable-next-line:max-line-length */}
          <meta
            property="og:description"
            content={`${journal.fullTitle} | IF: ${journal.impactFactor} | ${journal.paperCount} papers`}
          />
        </Helmet>
      );
    }
  };

  private handleSubmitSearch = (query: string) => {
    const { dispatch, journalShow } = this.props;

    dispatch(
      push({
        pathname: `/journals/${journalShow.journalId}`,
        search: `q=${query}`,
      })
    );
  };

  private restoreScroll = () => {
    window.scrollTo(0, 0);
  };

  private getPaperList = () => {
    const { journalShow, papers, currentUser } = this.props;

    const queryParams = this.getQueryParamsObject();
    const query = SafeURIStringHandler.decode(queryParams.q || "");

    if (journalShow.isLoadingPapers) {
      return (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      );
    }

    if (papers && papers.length > 0) {
      return papers.map(paper => {
        if (paper) {
          return (
            <PaperItem
              refererSection="journal_show"
              searchQueryText={query}
              currentUser={currentUser}
              paper={paper}
              key={`collection_papers_${paper.id}`}
            />
          );
        }
        return null;
      });
    } else {
      return (
        <div className={styles.noPaperWrapper}>
          <Icon icon="UFO" className={styles.ufoIcon} />
          <div className={styles.noPaperDescription}>No paper in this collection.</div>
        </div>
      );
    }
  };

  private handleClickPage = (page: number) => {
    const { dispatch, journalShow } = this.props;

    const currentQueryParams = this.getQueryParamsObject();
    const nextQueryParams = { ...currentQueryParams, p: page };

    dispatch(
      push({
        pathname: `/journals/${journalShow.journalId}`,
        search: stringify(nextQueryParams, { addQueryPrefix: true }),
      })
    );
  };

  private getPagination = () => {
    const { layout, journalShow } = this.props;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return (
        <MobilePagination
          totalPageCount={journalShow.paperTotalPage}
          currentPageIndex={journalShow.paperCurrentPage - 1}
          onItemClick={this.handleClickPage}
          wrapperStyle={{
            margin: "12px 0",
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type={`journal_show_papers`}
          totalPage={journalShow.paperTotalPage}
          currentPageIndex={journalShow.paperCurrentPage - 1}
          onItemClick={this.handleClickPage}
          wrapperStyle={{
            margin: "24px 0",
          }}
        />
      );
    }
  };
}

export default connect(mapStateToProps)(withRouter(JournalShowContainer));
