import * as React from "react";
import { parse } from "qs";
import { withRouter, RouteProps, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import { LoadDataParams } from "../../routes";
import { Helmet } from "react-helmet";
import { getPaper, clearPaperShowState } from "./actions";
import { PaperShowStateRecord } from "./records";
import PostAuthor from "./components/author";
import Keywords from "../articleSearch/components/searchItem/keywords";
import DOIButton from "../articleSearch/components/searchItem/dotButton";

const styles = require("./paperShow.scss");

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
  public componentDidMount() {
    const { paperShow, dispatch, match } = this.props;

    if (!paperShow.paper || paperShow.paper.isEmpty()) {
      getPaperData({
        dispatch,
        match,
        queryParams: this.getQueryParamsObject(),
      });
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(clearPaperShowState());
  }

  public render() {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (!paper || paper.isEmpty()) {
      return null;
    }

    return (
      <div className={styles.container}>
        {this.getPageHelmet()}
        <div className={styles.innerContainer}>
          {this.getLeftBox()}
          <div className={styles.rightBox}>pdf Download Leave a comment</div>
        </div>
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

  private getKeywordNode = () => {
    const { paperShow } = this.props;

    return (
      <div className={styles.keywordBox}>
        <div className={styles.keywordTitle}>Key word</div>
        <Keywords keywords={paperShow.paper.fosList} />
      </div>
    );
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
            paperShow.paper.venue} [IF: ${journal.impactFactor || null}]}`}
        </div>
      );
    }
  };

  private getQueryParamsObject() {
    const { routing } = this.props;
    return parse(routing.location.search, { ignoreQueryPrefix: true });
  }
}

export default connect(mapStateToProps)(withRouter(PaperShow));
