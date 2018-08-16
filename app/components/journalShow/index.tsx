import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { denormalize } from "normalizr";
import { Helmet } from "react-helmet";
import { AppState } from "../../reducers";
import PaperItem from "../common/paperItem";
import MobilePagination from "../common/mobilePagination";
import DesktopPagination from "../common/desktopPagination";
import ArticleSpinner from "../common/spinner/articleSpinner";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import { Configuration } from "../../reducers/configuration";
import { fetchJournalShowPageData } from "./sideEffect";
import { paperSchema, Paper } from "../../model/paper";
import { journalSchema, Journal } from "../../model/journal";
import { JournalShowState } from "./reducer";
import Footer from "../layouts/footer";
import Icon from "../../icons";
import { LayoutState, UserDevice } from "../layouts/records";
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
  public componentDidMount() {
    const { dispatch, match, configuration } = this.props;

    const notRenderedAtServerOrJSAlreadyInitialized = !configuration.initialFetched || configuration.clientJSRendered;
    if (notRenderedAtServerOrJSAlreadyInitialized) {
      fetchJournalShowPageData({
        dispatch,
        match,
        pathname: location.pathname,
      });
    }
  }

  public componentWillReceiveProps(nextProps: JournalShowProps) {
    const { dispatch, match, location } = nextProps;
    const currentJournalId = this.props.match.params.journalId;
    const nextJournalId = match.params.journalId;
    if (currentJournalId !== nextJournalId) {
      fetchJournalShowPageData({
        dispatch,
        match,
        pathname: location.pathname,
      });
    }
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
        <div className={styles.collectionShowWrapper}>
          {this.getPageHelmet()}
          <div className={styles.headSection}>
            <div className={styles.container}>
              <div className={styles.leftBox}>
                <div className={styles.title}>
                  <span>{journal.fullTitle}</span>
                </div>
                <div className={styles.infoWrapper}>
                  <span>
                    <div className={styles.subtitle}>IF</div>
                    <strong>{journal.impactFactor || "N/A"}</strong>
                  </span>
                  <span>
                    <div className={styles.subtitle}>Papers</div>
                    <strong>{journal.paperCount}</strong>
                  </span>
                </div>
              </div>
              <div className={styles.rightBox} />
            </div>
          </div>

          <div className={styles.paperListContainer}>
            <div className={styles.leftBox}>
              <div className={styles.paperListBox}>
                <div className={styles.header}>
                  <div className={styles.listTitle}>
                    <span>{`Papers `}</span>
                    <span className={styles.paperCount}>{journal.paperCount}</span>
                  </div>
                </div>
                <div>{this.getPaperList()}</div>
              </div>
            </div>
            <div className={styles.rightBox} />
          </div>
          <Footer containerStyle={{ backgroundColor: "white" }} />
        </div>
      );
    } else {
      return null;
    }
  }

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

  private getPaperList = () => {
    const { papers, currentUser } = this.props;

    if (papers && papers.length > 0) {
      return papers.map(paper => {
        if (paper) {
          return <PaperItem currentUser={currentUser} paper={paper} key={`collection_papers_${paper.id}`} />;
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

  private getPagination = () => {
    const { layout, journalShow } = this.props;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return (
        <MobilePagination
          totalPageCount={journalShow.paperTotalPage}
          currentPageIndex={journalShow.paperCurrentPage - 1}
          onItemClick={}
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
          onItemClick={}
          wrapperStyle={{
            margin: "24px 0",
          }}
        />
      );
    }
  };
}

export default connect(mapStateToProps)(withRouter(JournalShowContainer));
