import * as React from "react";
const styles = require("./article.scss");

interface IUserArticlesProps {}

class UserArticles extends React.PureComponent<IUserArticlesProps, {}> {
  private fetchUserArticles() {}

  public componentDidMount() {
    this.fetchUserArticles();
  }

  public componentWillReceiveProps() {}

  public componentWillUnmount() {}

  public render() {
    return <div className={styles.userArticleContainer} />;
  }
}

export default UserArticles;
