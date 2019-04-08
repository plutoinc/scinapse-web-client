export default function getRobotTxt(isProd: boolean) {
  if (isProd) {
    return `
    User-agent: Googlebot
    User-agent: Mediapartners-Google
    User-agent: Bingbot
    User-agent: MSNBot
    User-agent: YandexBot
    User-agent: Slurp
    User-agent: DuckDuckBot
    User-agent: ia_archiver
    Disallow: /papers/*/cited
    Disallow: /papers/*/ref
    Allow: /

    User-agent: * 
    Disallow: /
    `;
  }
  return `
    User-agent: *
    Disallow: /
    `;
}
