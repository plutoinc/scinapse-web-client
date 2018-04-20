function getBaseURI() {
  if (process.env.NODE_ENV === "production") {
    return "https://scinapse.io";
  }
  return "https://stage.scinapse.io";
}

exports.default = getBaseURI;
