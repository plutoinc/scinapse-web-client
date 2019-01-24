export default function getResponseObjectForRobot(isProd: boolean) {
  if (isProd) {
    const content = `
    User-agent: *
    Disallow: /papers/*/cited
    Disallow: /papers/*/ref
    `;
    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "max-age=100",
        "Content-Type": "text/plain",
      },
      isBase64Encoded: false,
      body: content,
    };
  } else {
    const content = `
    User-agent: *
    Disallow: /
    `;
    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "max-age=100",
        "Content-Type": "text/plain",
      },
      isBase64Encoded: false,
      body: content,
    };
  }
}
