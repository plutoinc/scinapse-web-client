import * as React from "react";
import { Route, Switch } from "react-router-dom";

// containers
import { Header, Footer } from "./components/layouts";
import ArticleFeed from "./components/articleFeed";
import ArticleShow from "./components/articleShow";
import ArticleCreate from "./components/articleCreate";
import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";
import { RequestError } from "./components/error/notFound";
import { ServerError } from "./components/error/serverError";

// styles
import "normalize.css";
import "./root.scss";

const routesMap = (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={ArticleFeed} />
      <Route exact path="/articles" component={ArticleFeed} />
      <Route exact path="/articles/new" component={ArticleCreate} />
      <Route exact path="/400" component={RequestError} />
      <Route exact path="/500" component={ServerError} />
      <Route path="/articles/:articleId" component={ArticleShow} />
      <Route path="/users" component={AuthComponent} />
      <Route path="*" component={RequestError} />
    </Switch>
    <DialogComponent />
    <Footer />
  </div>
);

export default routesMap;
