import * as React from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";

interface IAuthRouteParam {
  path: string;
  Component?: React.ComponentClass<any>;
  children?: ((props: RouteComponentProps<any>) => React.ReactNode) | React.ReactNode;
  isLoggedIn: boolean;
  shouldLoggedIn: boolean;
  rest?: any;
}

export const AuthRoute = (params: IAuthRouteParam) => {
  const { path, Component, children, isLoggedIn, shouldLoggedIn, rest } = params;
  const redirectPath: string = shouldLoggedIn ? "/users/sign_in" : "/";

  if (isLoggedIn !== shouldLoggedIn) {
    // TODO : Add Notification
    return (
      <Route
        path={path}
        render={props => (
          <Redirect
            to={{
              pathname: redirectPath,
              state: { from: props.location },
            }}
          />
        )}
      />
    );
  } else if (Component !== undefined) {
    return <Route path={path} {...rest} component={Component} />;
  } else if (children !== undefined) {
    return <Route path={path} {...rest} children={children} />;
  }
};

export default AuthRoute;
