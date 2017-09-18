import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { ICurrentUserStateRecord } from "../../model/currentUser";
import TagList from "./components/tagList";
import { getMockArticle } from "./__mocks__/mockArticle";
const styles = require("./articleShow.scss");

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
      // TODO: Add load article logic
      // loadArticle(articleId);
    }
  }

  public render() {
    //TODO: Remove mockArticle after setting API
    const mockArticle = getMockArticle();

    return (
      <div className={styles.articleShowContainer}>
        <TagList tags={mockArticle.tags} />
        <div>title</div>
        <div>post info section</div>
        <div>post authors section</div>
        <div>Abstract section</div>
        <div>Article Section</div>
        <div>Evaluate Section</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ArticleShow);
