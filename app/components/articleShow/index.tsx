import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { ICurrentUserStateRecord } from "../../model/currentUser";
import { getMockArticle } from "./__mocks__/mockArticle";
import TagList from "./components/tagList";
import ArticleInfo from "./components/articleInfo";
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
        <div className={styles.title}>{mockArticle.title}</div>
        <ArticleInfo from="Arxiv" createdAt="July 17, 2017" user={{ nickName: "Jeffrey C. Lagarias" }} />
        <div>post authors section</div>
        <div>Abstract section</div>
        <div>Article Section</div>
        <div>Evaluate Section</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ArticleShow);
