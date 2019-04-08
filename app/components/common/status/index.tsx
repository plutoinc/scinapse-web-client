import * as React from "react";
import { Route } from "react-router-dom";

interface StatusProps {
  code: number;
}

const Status: React.SFC<StatusProps> = ({ code, children }) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) {
        staticContext.statusCode = code;
      }
      return children;
    }}
  />
);

export default Status;
