import * as React from "react";
import { IProfileStateRecord } from "../records";
import FeedItem from "../../articleFeed/components/feedItem";
const styles = require("./article.scss");

interface IUserArticlesProps {
  userId: number;
  profileState: IProfileStateRecord;
  fetchUserArticles: (userId: number) => void;
  cancelFetchingFunction: () => void;
}

class UserArticles extends React.PureComponent<IUserArticlesProps, {}> {
  private mapArticlesNode = () => {
    const { profileState } = this.props;

    return profileState.articlesToShow.map(article => {
      return <FeedItem key={`profile_article_${article.id}`} article={article} />;
    });
  };

  public componentDidMount() {
    const { userId, fetchUserArticles } = this.props;

    fetchUserArticles(userId);
  }

  public componentWillReceiveProps(nextProps: IUserArticlesProps) {
    if (this.props.userId !== nextProps.userId) {
      this.props.cancelFetchingFunction();
      this.props.fetchUserArticles(this.props.userId);
    }
  }

  public componentWillUnmount() {
    this.props.cancelFetchingFunction();
  }

  public render() {
    return <div className={styles.userArticleContainer}>{this.mapArticlesNode()}</div>;
  }
}

export default UserArticles;
