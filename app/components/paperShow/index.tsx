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
      cognitiveId: queryParams.cognitiveId,
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

    if (!paperShow) {
      return null;
    }

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{paperShow.paper.title} | Pluto Beta | Academic discovery</title>
        </Helmet>
        HELLO SHOW
      </div>
    );
  }

  // private getPaperId() {
  //   const { match } = this.props;
  //   return parseInt(match.params.paperId, 10);
  // }

  private getQueryParamsObject() {
    const { routing } = this.props;
    return parse(routing.location.search, { ignoreQueryPrefix: true });
  }
}

export default connect(mapStateToProps)(withRouter(PaperShow));
