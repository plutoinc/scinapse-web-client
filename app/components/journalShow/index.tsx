import * as React from 'react';
import { parse, stringify } from 'qs';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { denormalize } from 'normalizr';
import { Helmet } from 'react-helmet';
import { AppState } from '../../reducers';
import FullPaperItem from '../common/paperItem/fullPaperItem';
import MobilePagination from '../common/mobilePagination';
import DesktopPagination from '../common/desktopPagination';
import ArticleSpinner from '../common/spinner/articleSpinner';
import { withStyles } from '../../helpers/withStylesHelper';
import { CurrentUser } from '../../model/currentUser';
import { Configuration } from '../../reducers/configuration';
import { fetchJournalShowPageData, JournalShowQueryParams } from './sideEffect';
import { paperSchema, Paper } from '../../model/paper';
import { journalSchema, Journal } from '../../model/journal';
import { JournalShowState as JournalShowGlobalState } from './reducer';
import Icon from '../../icons';
import { LayoutState } from '../layouts/reducer';
import formatNumber from '../../helpers/formatNumber';
import SortBox, { PAPER_LIST_SORT_TYPES } from '../common/sortBox';
import PaperShowKeyword from '../paperShow/components/keyword';
import ActionTicketManager from '../../helpers/actionTicketManager';
import restoreScroll from '../../helpers/scrollRestoration';
import ErrorPage from '../error/errorPage';
import { JournalShowMatchParams } from './types';
import ImprovedFooter from '../layouts/improvedFooter';
import { UserDevice } from '../layouts/reducer';
import { InputField } from '@pluto_network/pluto-design-elements';
const styles = require('./journalShow.scss');

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

export interface JournalShowProps
  extends RouteComponentProps<JournalShowMatchParams>,
    Readonly<{
      layout: LayoutState;
      currentUser: CurrentUser;
      configuration: Configuration;
      journalShow: JournalShowGlobalState;
      journal: Journal | undefined;
      papers: Paper[] | undefined;
      dispatch: Dispatch<any>;
    }> {}

interface JournalShowLocalState {
  currentQuery: string;
}

@withStyles<typeof JournalShowContainer>(styles)
class JournalShowContainer extends React.PureComponent<JournalShowProps, JournalShowLocalState> {
  public constructor(props: JournalShowProps) {
    super(props);

    this.state = {
      currentQuery: '',
    };
  }

  public async componentDidMount() {
    const { dispatch, match, configuration, location, journalShow } = this.props;

    const notRenderedAtServerOrJSAlreadyInitialized =
      !configuration.succeedAPIFetchAtServer || configuration.renderedAtClient;
    const alreadyFetchedData = journalShow.journalId.toString() === match.params.journalId;

    if (notRenderedAtServerOrJSAlreadyInitialized && !alreadyFetchedData) {
      await fetchJournalShowPageData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: location.search,
      });
      restoreScroll(location.key);
    }
  }

  public async componentWillReceiveProps(nextProps: JournalShowProps) {
    const { dispatch, match, location, currentUser } = nextProps;
    const currentJournalId = this.props.match.params.journalId;
    const nextJournalId = match.params.journalId;

    if (
      currentJournalId !== nextJournalId ||
      this.props.location.search !== location.search ||
      currentUser.isLoggedIn !== this.props.currentUser.isLoggedIn
    ) {
      await fetchJournalShowPageData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: location.search,
      });
      restoreScroll(location.key);
    }
  }

  public render() {
    const { journalShow, journal } = this.props;
    const { currentQuery } = this.state;

    if (journalShow.pageErrorCode) {
      return <ErrorPage errorNum={journalShow.pageErrorCode} />;
    }

    if (journalShow.isLoadingJournal) {
      return (
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
          </div>
        </div>
      );
    } else if (journal) {
      const currentQueryParams = this.getQueryParamsObject();

      return (
        <div>
          <div className={styles.journalShowWrapper}>
            {this.getPageHelmet()}
            <div className={styles.headSection}>
              <div className={styles.container}>
                <div className={styles.leftBox}>
                  <div className={styles.title}>
                    <span>
                      {journal.title}
                      {this.getExternalLink()}
                    </span>
                  </div>
                  <div className={styles.infoWrapper}>
                    {journal.impactFactor ? (
                      <span>
                        <div className={styles.subtitle}>IF</div>
                        <strong>{journal.impactFactor.toFixed(2)}</strong>
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
                        <InputField
                          trailingIcon={
                            <Icon
                              icon="SEARCH"
                              onClick={() => {
                                this.handleSubmitSearch(currentQuery);
                              }}
                            />
                          }
                          placeholder="Search papers"
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              this.handleSubmitSearch(e.currentTarget.value);
                            }
                          }}
                          onChange={e => {
                            this.setState({ currentQuery: e.currentTarget.value });
                          }}
                          defaultValue={currentQueryParams.q}
                        />
                      </div>
                    </div>
                    <div className={styles.subHeader}>
                      <div className={styles.resultPaperCount}>{`${journalShow.paperCurrentPage} page of ${formatNumber(
                        journalShow.paperTotalPage
                      )} pages (${formatNumber(journalShow.filteredPaperCount)} results)`}</div>
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
          </div>
          <ImprovedFooter containerStyle={{ backgroundColor: '#f8f9fb' }} />
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
        <PaperShowKeyword pageType="journalShow" actionArea="topFos" key={fos.id} fos={fos}>
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
        <a
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType: 'journalShow',
              actionType: 'fire',
              actionArea: 'journalShow',
              actionTag: 'journalHomepage',
              actionLabel: String(journal.id),
            });
          }}
          href={journal.webPage}
          target="_blank"
          rel="noopener nofollow noreferrer"
          className={styles.externalIconWrapper}
        >
          <Icon icon="EXTERNAL_SOURCE" />
        </a>
      );
    }
    return null;
  };

  private getSortBox = () => {
    const queryParams = this.getQueryParamsObject();
    const shouldExposeRelevanceOption = !!queryParams.q;
    const sortOption = queryParams.s || 'NEWEST_FIRST';

    return (
      <SortBox
        onClickOption={this.handleSortOptionChange}
        sortOption={sortOption}
        currentPage="journalShow"
        exposeRelevanceOption={shouldExposeRelevanceOption}
      />
    );
  };

  private handleSortOptionChange = (sortOption: PAPER_LIST_SORT_TYPES) => {
    const { journalShow, history } = this.props;

    const currentQueryParams = this.getQueryParamsObject();
    const nextQueryParams = { ...currentQueryParams, s: sortOption, q: journalShow.searchKeyword, p: 1 };

    history.push({
      pathname: `/journals/${journalShow.journalId}`,
      search: stringify(nextQueryParams, { addQueryPrefix: true }),
    });
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
          <title>{journal.title} | Scinapse</title>
          <link rel="canonical" href={`https://scinapse.io/journals/${journal.id}`} />
          <meta itemProp="name" content={`${journal.title} | Scinapse`} />
          <meta
            name="description"
            content={`${journal.title} | IF: ${(journal.impactFactor || 0).toFixed(2)} | ISSN: ${journal.issn || 0} | ${
              journal.paperCount
            } papers`}
          />
          <meta name="twitter:title" content={`${journal.title} | Scinapse`} />
          <meta
            name="twitter:description"
            content={`${journal.title} | IF: ${(journal.impactFactor || 0).toFixed(2)} | ISSN: ${journal.issn || 0} | ${
              journal.paperCount
            } papers`}
          />
          <meta name="twitter:card" content={`${journal.title} | Scinapse`} />
          <meta property="og:title" content={`${journal.title} | Scinapse`} />
          <meta
            property="og:description"
            content={`${journal.title} | IF: ${(journal.impactFactor || 0).toFixed(2)} | ISSN: ${journal.issn || 0} | ${
              journal.paperCount
            } papers`}
          />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://scinapse.io/journals/${journal.id}`} />
        </Helmet>
      );
    }
  };

  private handleSubmitSearch = (query: string) => {
    const { journalShow, history } = this.props;

    const currentQueryParams = this.getQueryParamsObject();
    const nextQueryParams = { ...currentQueryParams, q: query, p: 1 };

    ActionTicketManager.trackTicket({
      pageType: 'journalShow',
      actionType: 'fire',
      actionArea: 'paperList',
      actionTag: 'query',
      actionLabel: query,
    });

    history.push({
      pathname: `/journals/${journalShow.journalId}`,
      search: stringify(nextQueryParams, { addQueryPrefix: true }),
    });
  };

  private resetQuery = () => {
    const { journalShow, history } = this.props;

    const currentQueryParams = this.getQueryParamsObject();
    const nextQueryParams = { ...currentQueryParams, q: '', p: 1 };

    ActionTicketManager.trackTicket({
      pageType: 'journalShow',
      actionType: 'fire',
      actionArea: 'paperList',
      actionTag: 'query',
      actionLabel: '',
    });

    history.push({
      pathname: `/journals/${journalShow.journalId}`,
      search: stringify(nextQueryParams, { addQueryPrefix: true }),
    });
  };

  private getPaperList = () => {
    const { journalShow, papers } = this.props;

    if (journalShow.isLoadingPapers) {
      return (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      );
    }

    if (papers && papers.length > 0) {
      return papers.map(paper => {
        return <FullPaperItem key={paper.id} paper={paper} pageType="journalShow" actionArea="paperList" />;
      });
    }

    return (
      <div className={styles.noPaperWrapper}>
        <Icon icon="UFO" className={styles.ufoIcon} />
        <div className={styles.noPaperDescription}>
          Your search <b>{journalShow.searchKeyword}</b> did not match any papers.
        </div>
        <button className={styles.reloadBtn} onClick={this.resetQuery}>
          <Icon icon="RELOAD" className={styles.reloadIcon} />
          Reload papers
        </button>
      </div>
    );
  };

  private handleClickPage = (page: number) => {
    const { history, journalShow } = this.props;

    const currentQueryParams = this.getQueryParamsObject();
    const nextQueryParams = { ...currentQueryParams, p: page };

    history.push({
      pathname: `/journals/${journalShow.journalId}`,
      search: stringify(nextQueryParams, { addQueryPrefix: true }),
    });
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
            margin: '12px 0',
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
            margin: '24px 0',
          }}
        />
      );
    }
  };
}

export default connect(mapStateToProps)(withRouter(JournalShowContainer));
