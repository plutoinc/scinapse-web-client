import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import ArticleFeed from "./feed";
import ArticleShow from "../articleShow";

interface IArticleProps extends RouteComponentProps<any> {}

export default class Article extends React.PureComponent<IArticleProps, {}> {
  public render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ArticleFeed} />
        <Route path={`${match.url}/:articleId`} component={ArticleShow} />
      </Switch>
    );
  }
}
