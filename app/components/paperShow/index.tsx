import * as React from "react";
import { withRouter, RouteProps, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import { LoadDataParams } from "../../routes";
import { Helmet } from "react-helmet";

const styles = require("./paperShow.scss");

function mapStateToProps(state: AppState) {
  return {
    routing: state.routing,
    currentUser: state.currentUser,
  };
}

export async function getPaperData({ dispatch, queryParams }: LoadDataParams) {
  console.log(dispatch, queryParams);
}

export interface PaperShowMappedState {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
}

export interface PaperShowProps extends DispatchProp<PaperShowMappedState>, RouteComponentProps<{ paperId: string }> {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, {}> {
  private paperId = this.getPaperId();

  public componentDidMount() {
    const { dispatch } = this.props;

    console.log(this.paperId, dispatch);
    // dispatch(getPaperData(this.paperId));
  }

  public render() {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>Paper title | Pluto Beta | Academic discovery</title>
        </Helmet>
        HELLO SHOW
      </div>
    );
  }

  private getPaperId() {
    const { match } = this.props;
    return parseInt(match.params.paperId, 10);
  }
}

export default connect(mapStateToProps)(withRouter(PaperShow));
