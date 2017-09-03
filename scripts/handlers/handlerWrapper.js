"use strict";
exports.__esModule = true;
var HandlerWrapper = /** @class */ (function () {
    function HandlerWrapper() {
    }
    HandlerWrapper.safelyWrap = function (handler) {
        return function (event, context) {
            var result = handler(event, context);
            var isPromise = Promise.resolve(result) === result;
            if (isPromise) {
                var promise = result;
                promise.then(function (response) {
                    context.done(null, response);
                }, function (error) {
                    context.done(error);
                });
            }
        };
    };
    return HandlerWrapper;
}());
exports["default"] = HandlerWrapper;
