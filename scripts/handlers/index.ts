import HandlerWrapper from "./handlerWrapper";
// List of handlers
import render from "./frontRender";

const handlers = {
  render: HandlerWrapper.safelyWrap(render),
};

export = handlers;
