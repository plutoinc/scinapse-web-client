import * as React from "react";
import { Route, Switch } from "react-router-dom";

// containers
import { Header, Footer } from "./components/layouts";
import ArticleFeed from "./components/articleFeed";
import ArticleShow from "./components/articleShow";
import ArticleCreate from "./components/articleCreate";

import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";

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
    <Header />
    <Switch>
      <Route exact path="/" component={ArticleFeed} />
      <Route exact path="/articles" component={ArticleFeed} />
      <Route exact path="/articles/new" component={ArticleCreate} />
      <Route path="/articles/:articleId" component={ArticleShow} />
      <Route path="/users" component={AuthComponent} />
      <Route path="*" component={NotFound} />
    </Switch>
    <DialogComponent />
    <Footer />
  </div>
);

export default routesMap;
