"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var path = require("path");
var React = require("react");
var react_redux_1 = require("react-redux");
var axios_1 = require("axios");
var react_helmet_1 = require("react-helmet");
var react_router_dom_1 = require("react-router-dom");
var styles_1 = require("@material-ui/core/styles");
var ReactDOMServer = require("react-dom/server");
var server_1 = require("@loadable/server");
var store_1 = require("../app/store");
var routes_1 = require("../app/routes");
var actionTypes_1 = require("../app/actions/actionTypes");
var cssInjector_1 = require("../app/helpers/cssInjector");
var htmlWrapper_1 = require("../app/helpers/htmlWrapper");
var JssProvider = require("react-jss/lib/JssProvider")["default"];
var SheetsRegistry = require("react-jss/lib/jss").SheetsRegistry;
var statsFile = path.resolve(__dirname, "../client/loadable-stats.json");
var extractor = new server_1.ChunkExtractor({ statsFile: statsFile });
var ssr = function (req, version) { return __awaiter(_this, void 0, void 0, function () {
    var store, promises, css, context, routeContext, sheetsRegistry, theme, generateClassName, jsx, renderedHTML, scriptTags, linkTags, styleTags, materialUICss, cssArr, helmet, currentState, stringifiedInitialReduxState, html;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // override user request
                axios_1["default"].defaults.headers.common = __assign({}, axios_1["default"].defaults.headers.common, { "user-agent": req.headers["user-agent"] || "", "x-forwarded-for": req.headers["x-forwarded-for"] || "", referer: req.headers.referer || "", "x-from-ssr": true });
                // Initialize and make Redux store per each request
                store_1["default"].initializeStore(req.originalUrl);
                store = store_1["default"].store;
                promises = [];
                routes_1.routesMap.some(function (route) {
                    var match = react_router_dom_1.matchPath(req.path, route);
                    if (match && !!route.loadData) {
                        promises.push(route.loadData({
                            dispatch: store.dispatch,
                            match: match,
                            queryParams: req.query,
                            pathname: req.path,
                            cancelToken: axios_1["default"].CancelToken.source().token
                        }));
                    }
                    return !!match;
                });
                return [4 /*yield*/, Promise.all(promises)
                        .then(function () {
                        store.dispatch({
                            type: actionTypes_1.ACTION_TYPES.GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING
                        });
                    })["catch"](function (err) {
                        console.error("Fetching data error at server - " + err);
                    })];
            case 1:
                _a.sent();
                css = new Set();
                context = {
                    insertCss: function () {
                        var styles = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            styles[_i] = arguments[_i];
                        }
                        return styles.forEach(function (style) { return css.add(style._getCss()); });
                    }
                };
                routeContext = {};
                sheetsRegistry = new SheetsRegistry();
                theme = styles_1.createMuiTheme({
                    typography: {
                        useNextVariants: true
                    }
                });
                generateClassName = styles_1.createGenerateClassName();
                jsx = extractor.collectChunks(<cssInjector_1["default"] context={context}>
      <react_redux_1.Provider store={store}>
        <react_router_dom_1.StaticRouter location={req.url} context={routeContext}>
          <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <styles_1.MuiThemeProvider theme={theme} sheetsManager={new Map()}>
              <routes_1.ConnectedRootRoutes />
            </styles_1.MuiThemeProvider>
          </JssProvider>
        </react_router_dom_1.StaticRouter>
      </react_redux_1.Provider>
    </cssInjector_1["default"]>);
                renderedHTML = ReactDOMServer.renderToString(jsx);
                scriptTags = extractor.getScriptTags();
                linkTags = extractor.getLinkTags();
                styleTags = extractor.getStyleTags();
                // TODO: remove below console
                // TODO: add prefetch
                console.log("scriptTags === ", scriptTags);
                console.log("linkTags === ", linkTags);
                console.log("styleTags === ", styleTags);
                materialUICss = sheetsRegistry.toString();
                cssArr = Array.from(css);
                helmet = react_helmet_1.Helmet.renderStatic();
                currentState = store.getState();
                stringifiedInitialReduxState = JSON.stringify(currentState);
                return [4 /*yield*/, htmlWrapper_1.generateFullHTML({
                        reactDom: renderedHTML,
                        scriptTags: scriptTags,
                        helmet: helmet,
                        initialState: stringifiedInitialReduxState,
                        css: cssArr.join("") + materialUICss,
                        version: version
                    })];
            case 2:
                html = _a.sent();
                return [2 /*return*/, html];
        }
    });
}); };
exports["default"] = ssr;
