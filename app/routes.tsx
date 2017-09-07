import * as React from "react";
import { Route } from "react-router-dom";

// containers
import { Header, Footer } from './components/layouts';
import HomeComponent from "./components/home";
import AuthComponent from "./components/auth";

// styles
import 'normalize.css';
import './routes.scss';

const routesMap = (
  <div>
    <Header />
    <Route exact path="/" component={HomeComponent} />
    <Route path="/user" component={AuthComponent} />
    <Footer />
  </div>
);

export default routesMap;
