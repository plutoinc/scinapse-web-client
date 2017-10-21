import * as React from "react";
import InfiniteScroll = require("react-infinite-scroller");
import { IProfileStateRecord } from "../records";
import FeedItem from "../../articleFeed/components/feedItem";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import ProfileEmptyContent from "./noContent";
const styles = require("./article.scss");

interface IUserArticlesProps {
  userId: number;
  profileState: IProfileStateRecord;
  fetchUserArticles: (userId: number) => void;
  cancelFetchingFunction: () => void;
  clearFunction: () => void;
}

class UserArticles extends React.PureComponent<IUserArticlesProps, {}> {
  private mapArticlesNode = () => {
    const { userId, profileState, fetchUserArticles } = this.props;

    if (!profileState.articlesToShow || profileState.articlesToShow.isEmpty()) {
      return <ProfileEmptyContent type="article" />;
    } else {
      const articleNodes = profileState.articlesToShow.map(article => {
        return <FeedItem key={`profile_article_${article.id}`} article={article} />;
      });

      return (
        <InfiniteScroll
          pageStart={0}
          threshold={400}
          loadMore={() => {
            fetchUserArticles(userId);
          }}
          hasMore={!profileState.isEnd}
          loader={
            <div className={styles.spinnerWrapper}>
              <ArticleSpinner />
            </div>
          }
          initialLoad={false}
        >
          {articleNodes}
        </InfiniteScroll>
      );
    }
  };

  public componentDidMount() {
    const { userId, fetchUserArticles } = this.props;
    fetchUserArticles(userId);
  }

  public componentWillReceiveProps(nextProps: IUserArticlesProps) {
    if (this.props.userId !== nextProps.userId) {
      this.props.cancelFetchingFunction();
      this.props.clearFunction();
      this.props.fetchUserArticles(this.props.userId);
    }
  }

  public componentWillUnmount() {
    this.props.cancelFetchingFunction();
    this.props.clearFunction();
  }

  public render() {
    return (
      <div className={styles.userArticleContainer}>
        <div className={styles.articlesWrapper}>{this.mapArticlesNode()}</div>
      </div>
    );
  }
}

export default UserArticles;
