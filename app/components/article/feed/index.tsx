import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { IArticleFeedStateRecord } from "./records";
import { IAppState } from "../../../reducers";
import { openSignIn, openSignUp } from "../../dialog/actions";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import ButtonSpinner from "../../common/spinner/buttonSpinner";

export interface IArticleFeedContainerProps extends DispatchProp<IArticleContainerMappedState> {
  articleFeedState: IArticleFeedStateRecord;
}

interface IArticleContainerMappedState {
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

  private openSignUp = () => {
    const { dispatch } = this.props;
    dispatch(openSignUp());
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
        <button onClick={this.openSignIn}>Open Sign_in</button>
        <button onClick={this.openSignUp}>Open Sign_up</button>
        <ArticleSpinner />
        <ButtonSpinner />
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleFeed);
