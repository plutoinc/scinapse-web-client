import HandlerWrapper from "./handlerWrapper";
import render from "./frontRender";

const handlers = {
  render: HandlerWrapper.safelyWrap(render),
};

export = handlers;
