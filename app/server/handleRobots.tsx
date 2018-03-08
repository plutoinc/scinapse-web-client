export default function getResponseObjectForRobot(stage: string) {
  if (stage === "prod") {
    const content = `
    User-agent: *
    Disallow:
    `;
    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "max-age=100",
        "Content-Type": "text/plain",
      },
      body: content,
    };
  } else if (stage === "stage") {
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
      body: content,
    };
  }
}
