import * as React from "react";
import { RouteProps, Redirect, Route } from "react-router-dom";
import alertToast from "./makePlutoToastAction";

export enum AuthType {
  ShouldLoggedIn,
  ShouldLoggedOut,
}

interface AuthRouteParam {
  isLoggedIn: boolean;
  needAuthType: AuthType;
}

export const AuthRoute: React.FunctionComponent<AuthRouteParam & RouteProps> = props => {
  const { path, component, children, isLoggedIn, needAuthType } = props;

  let redirectPath;
  let notificationMessage;
  if (needAuthType === AuthType.ShouldLoggedIn) {
    redirectPath = "/users/sign_in";
    notificationMessage = "You need to login first!";
  } else if (needAuthType === AuthType.ShouldLoggedOut) {
    redirectPath = "/";
    notificationMessage = "You already logged in!";
  }

  const forbiddenAccess =
    (isLoggedIn && needAuthType === AuthType.ShouldLoggedOut) ||
    (!isLoggedIn && needAuthType === AuthType.ShouldLoggedIn);
  const isComponent = !!component;
  const isChildren = !!children;

  if (forbiddenAccess) {
    alertToast({
      type: "error",
      message: notificationMessage || "",
    });

    return (
      <Redirect
        to={{
          pathname: redirectPath,
        }}
      />
    );
  } else if (isComponent) {
    return <Route path={path} component={component} exact={true} />;
  } else if (isChildren) {
    return <Route path={path} children={children} exact={true} />;
  } else {
    return null;
  }
};

export default AuthRoute;
