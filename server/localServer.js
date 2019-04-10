"use strict";
exports.__esModule = true;
var _1 = require("./");
var port = Number(process.env.PORT) || 3000;
_1["default"]
    .listen(port, function () { return console.log("Express server listening at " + port + "! Visit https://localhost:" + port); })
    .on("error", function (err) { return console.error("LOCAL_SERVER_ERROR =======================", err); });
