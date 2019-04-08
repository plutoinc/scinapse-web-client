"use strict";

exports.handler = (event, context, callback) => {
  const HOST = "https://scinapse.io";
  const request = event.Records[0].cf.request;
  const requestHost = request.headers["host"][0].value;

  let response;
  if (requestHost === "scinapse.io") {
    response = request;
  } else {
    const targetLocation = request.querystring ? `${HOST}${request.uri}?${request.querystring}` : HOST + request.uri;

    response = {
      status: "301",
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
