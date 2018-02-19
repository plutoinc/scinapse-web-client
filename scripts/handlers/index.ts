import HandlerWrapper from "./handlerWrapper";
import render from "./frontRender";
import ssr from "./ssr";

const handlers = {
  render: HandlerWrapper.safelyWrap(render),
  ssr: HandlerWrapper.safelyWrap(ssr),
};

export = handlers;
