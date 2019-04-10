"use strict";
exports.__esModule = true;
function getRobotTxt(isProd) {
    if (isProd) {
        return "\n    User-agent: Googlebot\n    User-agent: Mediapartners-Google\n    User-agent: Bingbot\n    User-agent: MSNBot\n    User-agent: YandexBot\n    User-agent: Slurp\n    User-agent: DuckDuckBot\n    User-agent: ia_archiver\n    Disallow: /papers/*/cited\n    Disallow: /papers/*/ref\n    Allow: /\n\n    User-agent: * \n    Disallow: /\n    ";
    }
    return "\n    User-agent: *\n    Disallow: /\n    ";
}
exports["default"] = getRobotTxt;
