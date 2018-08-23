import * as AWS from "aws-sdk";

export default async function handleSiteMapRequest(requestPath: string, context: Lambda.Context) {
  const s3 = new AWS.S3();

  if (requestPath === "/sitemap") {
    // sitemap index
    const body = await new Promise((resolve, reject) => {
      s3.getObject(
        {
          Bucket: "pluto-academic",
          Key: "sitemap/sitemapindex.xml",
        },
        (err: Error, data: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Body.toString("utf8"));
          }
        }
      );
    });

    return context.succeed({
      statusCode: 200,
      headers: {
        "Content-Type": "text/xml",
        "Access-Control-Allow-Origin": "*",
      },
      body,
    });
  } else {
    const body = await new Promise((resolve, reject) => {
      s3.getObject(
        {
          Bucket: "pluto-academic",
          Key: `sitemap/${requestPath.substring(1)}`,
        },
        (err: Error, data: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Body.toString("utf8"));
          }
        }
      );
    });

    return context.succeed({
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
      body,
    });
  }
}
