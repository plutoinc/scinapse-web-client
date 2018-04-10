import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { withRouter, RouteProps, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import EnvChecker from "../../helpers/envChecker";
const styles = require("./bookmark.scss");

function mapStateToProps(state: AppState) {
  return {
    routing: state.routing,
    currentUser: state.currentUser,
  };
}

export interface PaperShowMappedState {
  currentUser: CurrentUserRecord;
  routing: RouteProps;
}

export interface PaperShowProps extends DispatchProp<PaperShowMappedState>, RouteComponentProps<{ paperId: string }> {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
}

@withStyles<typeof Bookmark>(styles)
class Bookmark extends React.PureComponent<PaperShowProps, {}> {
  public render() {
    const { currentUser } = this.props;

    if (EnvChecker.isServer()) {
      return this.getHelmetNode();
    }

    if (!currentUser.isLoggedIn) {
      return <div className={styles.container}>You should sign in first.</div>;
    }

    return (
      <div className={styles.container}>
        {this.getHelmetNode()}
        <div className={styles.titleWrapper}>Bookmarked Papers</div>
      </div>
    );
  }

  private getHelmetNode = () => {
    return (
      <Helmet>
        <title>Bookmark | Sci-napse | Academic search engine for paper</title>
      </Helmet>
    );
  };
}

export default connect(mapStateToProps)(withRouter(Bookmark));
