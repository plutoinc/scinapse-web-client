import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IArticleFeedStateRecord } from "./records";
import { IAppState } from "../../../reducers";
import { openSignIn } from "../../dialog/actions";

export interface IArticleFeedContainerProps {
  dispatch: Dispatch<any>;
  articleFeedState: IArticleFeedStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    articleFeedState: state.articleFeed,
  };
}

class ArticleFeed extends React.PureComponent<IArticleFeedContainerProps, null> {
  private openSignIn = () => {
    const { dispatch } = this.props;
    dispatch(openSignIn());
  };

  render() {
    return (
      <div>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <h1>Article Feed</h1>
        <button onClick={this.openSignIn}>Open Dialog</button>
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleFeed);
