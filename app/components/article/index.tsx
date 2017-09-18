import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
// components
import ArticleFeed from "./feed";
import ArticleShow from "./show";

interface IArticleComponentProps extends RouteComponentProps<null> {}

export default class ArticleComponent extends React.PureComponent<IArticleComponentProps, null> {
  render() {
    const { match } = this.props;

    return (
      <div>
        <Switch>
          <Route exact path={`${match.url}`} component={ArticleFeed} />
          <Route path={`${match.url}show/:number`} component={ArticleShow} />
        </Switch>
      </div>
    );
  }
}
