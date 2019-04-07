"use strict";
exports.__esModule = true;
var abTest_1 = require("../../app/constants/abTest");
function setABTest(req, res) {
    if (req.cookies) {
        var keys_1 = Object.keys(req.cookies);
        abTest_1.LIVE_TESTS.forEach(function (test) {
            if (!keys_1.includes(test.name)) {
                var result = Math.random() < test.weight ? "A" : "B";
                res.cookie(test.name, result, {
                    maxAge: 31536000000
                });
            }
            else {
                res.cookie(test.name, req.cookies[test.name], {
                    maxAge: 31536000000
                });
            }
        });
    }
}
exports["default"] = setABTest;
