export default function getRobotTxt(isProd: boolean) {
  if (isProd) {
    return `
    User-agent: * 
    Disallow: /search
    Disallow: /search/*
    Disallow: /papers/*/cited
    Disallow: /papers/*/ref
    `;
  }
  return `
    User-agent: *
    Disallow: /
    `;
}
