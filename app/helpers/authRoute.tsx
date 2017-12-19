import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import { RouteProps } from "react-router";

export enum AuthType {
  ShouldLoggedIn,
  ShouldLoggedOut,
}

interface IAuthRouteParam extends RouteProps {
  isLoggedIn: Boolean;
  needAuthType: AuthType;
}

export const AuthRoute = (params: IAuthRouteParam) => {
  const { path, component, children, isLoggedIn, needAuthType } = params;
  let redirectPath: string;
  let notificationMessage: string;
  if (needAuthType === AuthType.ShouldLoggedIn) {
    redirectPath = "/users/sign_in";
    notificationMessage = "You need to login first!";
  } else if (needAuthType === AuthType.ShouldLoggedOut) {
    redirectPath = "/";
    notificationMessage = "You already logged in!";
  }

  if (
    (isLoggedIn && needAuthType === AuthType.ShouldLoggedOut) ||
    (!isLoggedIn && needAuthType === AuthType.ShouldLoggedIn)
  ) {
    alert(notificationMessage);

    return (
      <Redirect
        to={{
          pathname: redirectPath,
        }}
      />
    );
  } else if (component !== undefined) {
    return <Route path={path} {...params} component={component} />;
  } else if (children !== undefined) {
    return <Route path={path} {...params} children={children} />;
  }
};

export default AuthRoute;
