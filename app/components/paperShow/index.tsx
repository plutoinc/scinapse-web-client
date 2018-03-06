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
import { getPaper, clearPaperShowState, getComments } from "./actions";
import { PaperShowStateRecord } from "./records";
import PostAuthor from "./components/author";
import AxiosCancelTokenManager from "../../helpers/axiosCancelTokenManager";
import PaperShowKeyword from "./components/keyword";
import DOIButton from "../articleSearch/components/searchItem/dotButton";
import { IPaperSourceRecord } from "../../model/paperSource";
import Icon from "../../icons";
import { CancelTokenSource } from "axios";
const styles = require("./paperShow.scss");

const PAPER_SHOW_COMMENTS_PER_PAGE_COUNT = 6;

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

  public componentDidMount() {
    const { dispatch, match } = this.props;

    // if (!paperShow.paper || paperShow.paper.isEmpty()) {
    getPaperData({
      dispatch,
      match,
      queryParams: this.getQueryParamsObject(),
    });
    this.fetchComments();
    // }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(clearPaperShowState());
  }

  public render() {
    const { paperShow, match } = this.props;
    const { paper } = paperShow;

    if (!paper || paper.isEmpty()) {
      return null;
    }

    return (
      <div>
        {this.getPageHelmet()}
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            {this.getLeftBox()}
            <div className={styles.rightBox}>
              {this.getPDFDownloadButton()}
              {this.getCommentButton()}
            </div>
          </div>
        </div>
        {this.getTabs()}
        <Switch>
          <Route
            path={`${match.url}/`}
            render={() => {
              return <div>HELLO WORLD</div>;
            }}
            exact={true}
          />
          <Route
            path={`${match.url}/ref`}
            render={() => {
              return <div>HELLO REF</div>;
            }}
          />
          <Route
            path={`${match.url}/cited`}
            render={() => {
              return <div>HELLO CITED</div>;
            }}
          />
        </Switch>
      </div>
    );
  }

  private getLeftBox = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    return (
      <div className={styles.leftBox}>
        <h1 className={styles.title}>{paper.title}</h1>
        {this.getAuthors()}
        {this.getJournalInformationNode()}
        <DOIButton style={{ display: "inline-block", verticalAlign: "top" }} DOI={paper.doi} />
        <div className={styles.seperateLine} />
        {this.getAbstract()}
        {this.getKeywordNode()}
      </div>
    );
  };

  private getTabs = () => {
    const { paperShow, match, location } = this.props;
    const { paper } = paperShow;

    return (
      <div className={styles.tabWrapper}>
        <div className={styles.container}>
          <Link
            to={location.search ? `${match.url}${location.search}` : `${match.url}`}
            className={classNames({
              [`${styles.tabButton}`]: true,
              [`${styles.activeTab}`]: location.pathname === match.url,
            })}
          >
            {`Comments ${paper.commentCount}`}
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
      </div>
    );
  };

  private getCommentButton = () => {
    return <a className={styles.commentButton}>Leave a comment</a>;
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

    const keywordNodes = paperShow.paper.fosList.map((fos, index) => {
      return <PaperShowKeyword fos={fos} key={`${fos.fos}_${index}}`} />;
    });

    return <div className={styles.keywordBox}>{keywordNodes}</div>;
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

    return <div className={styles.authorBox}>{authors}</div>;
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
          {`Published ${paperShow.paper.year} in ${journal.fullTitle ||
            paperShow.paper.venue} [IF: ${journal.impactFactor || null}]`}
        </div>
      );
    }
  };

  private getQueryParamsObject() {
    const { routing } = this.props;
    return parse(routing.location.search, { ignoreQueryPrefix: true });
  }

  private getAxiosCancelToken() {
    const axiosCancelTokenManager = new AxiosCancelTokenManager();
    return axiosCancelTokenManager.getCancelTokenSource();
  }

  private fetchComments(page: number = 0) {
    const { paperShow, dispatch } = this.props;
    const { paper } = paperShow;

    const paperId = paper.cognitivePaperId ? paper.cognitivePaperId : paper.id;

    dispatch(
      getComments({
        paperId,
        page,
        size: PAPER_SHOW_COMMENTS_PER_PAGE_COUNT,
        cancelTokenSource: this.cancelTokenSource,
        cognitive: !!paper.cognitivePaperId,
      }),
    );
  }
}

export default connect(mapStateToProps)(withRouter(PaperShow));
