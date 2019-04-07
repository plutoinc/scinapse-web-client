"use strict";
exports.__esModule = true;
var react_helmet_1 = require("react-helmet");
var reducers_1 = require("../app/reducers");
var htmlWrapper_1 = require("../app/helpers/htmlWrapper");
function fallbackJSOnlyRender(scriptTags, version) {
    var helmet = react_helmet_1.Helmet.renderStatic();
    var fullHTML = htmlWrapper_1.generateFullHTML({
        reactDom: "",
        scriptTags: scriptTags,
        helmet: helmet,
        initialState: JSON.stringify(reducers_1.initialState),
        css: "",
        version: version
    });
    return fullHTML;
}
exports["default"] = fallbackJSOnlyRender;
