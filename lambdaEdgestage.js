"use strict";

exports.handler = (event, context, callback) => {
  const HOST = "https://stage.scinapse.io";
  const request = event.Records[0].cf.request;
  const requestHost = request.headers["host"][0].value;

  console.log(JSON.stringify(event));

  let response;
  if (requestHost === "stage.scinapse.io") {
    response = request;
  } else {
    const targetLocation = request.querystring ? `${HOST}${request.uri}?${request.querystring}` : HOST + request.uri;

    response = {
      status: "302",
      statusDescription: "Found",
      headers: {
        location: [
          {
            key: "Location",
            value: targetLocation,
          },
        ],
      },
    };
  }

  callback(null, response);
};
