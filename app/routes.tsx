import * as React from "react";
import { Route, Switch } from "react-router-dom";

// containers
import { Header, Footer } from "./components/layouts";
import ArticleFeed from "./components/article/feed";
import ArticleShow from "./components/articleShow";
import ArticleCreate from "./components/articleCreate";

import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";
import AuthChecker from "./components/authChecker";

// styles
import "normalize.css";
import "./root.scss";

// TODO: Make NotFound component and extract it
const NotFound = () => {
  return (
    <div style={{ marginTop: 75 }}>
      <h1>404, PAGE NOT FOUND</h1>
    </div>
  );
};

const routesMap = (
  <div>
    <AuthChecker />
    <Header />
    <Switch>
      ArticleFeed
      <Route exact path="/" component={ArticleFeed} />
      <Route path="/articles/:articleId" component={ArticleShow} />
      <Route path="/new" component={ArticleCreate} />
      <Route path="/users" component={AuthComponent} />
      <Route path="*" component={NotFound} />
    </Switch>
    <DialogComponent />
    <Footer />
  </div>
);

export default routesMap;
