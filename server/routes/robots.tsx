export default function getRobotTxt(isProd: boolean) {
  if (isProd) {
    return `
    User-agent: *
    Disallow: /papers/*/cited
    Disallow: /papers/*/ref
    `;
  }
  return `
    User-agent: *
    Disallow: /
    `;
}
