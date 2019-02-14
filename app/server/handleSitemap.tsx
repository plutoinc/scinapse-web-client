import * as AWS from "aws-sdk";

export default async function handleSiteMapRequest(requestPath: string) {
  const s3 = new AWS.S3();
  const responseHeader = {
    "Content-Type": "text/xml",
    "Content-Encoding": "gzip",
    "Access-Control-Allow-Origin": "*",
  };

  let s3ObjKey: string;
  if (requestPath === "/sitemap") {
    s3ObjKey = "sitemap.xml.gz";
  } else {
    const reqPathToken = requestPath.split("/");
    s3ObjKey = `${reqPathToken[reqPathToken.length - 1]}.gz`;
  }

  const body = await new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: "scinapse-sitemap",
        Key: s3ObjKey,
      },
      (err: Error, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Body);
        }
      }
    );
  });

  return {
    statusCode: 200,
    headers: responseHeader,
    isBase64Encoded: false,
    body,
  };
}
