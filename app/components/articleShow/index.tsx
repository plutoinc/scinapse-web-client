import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { ICurrentUserStateRecord } from "../../model/currentUser";

interface IArticlePageParams {
  articleId?: number;
}

interface IArticleShowProps
  extends RouteComponentProps<IArticlePageParams>,
    DispatchProp<IArticleContainerMappedState> {
  currentUser: ICurrentUserStateRecord;
}

interface IArticleContainerMappedState {
  currentUser: ICurrentUserStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUser: state.currentUser,
  };
}

@withRouter
class ArticleShow extends React.PureComponent<IArticleShowProps, {}> {
  public componentDidMount() {
    const { match } = this.props;
    const { articleId } = match.params;

    if (match.params.articleId) {
      console.log(articleId);
      // loadArticle(articleId);
    }
  }

  public render() {
    const { match } = this.props;
    const { articleId } = match.params;

    return <div style={{ marginTop: 300 }}>ARTICLE SHOW {articleId}</div>;
  }
}

export default connect(mapStateToProps)(ArticleShow);
