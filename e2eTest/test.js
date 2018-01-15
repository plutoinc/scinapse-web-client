describe("Pluto main page load", function() {
  before(function(client, done) {
    done();
  });

  after(function(client, done) {
    client.end(function() {
      done();
    });
  });

  afterEach(function(client, done) {
    done();
  });

  beforeEach(function(client, done) {
    done();
  });

  it("uses BDD to run the Google simple test", function(client) {
    client
      .url("https://poc.pluto.network")
      .expect.element("body")
      .to.be.present.before(1000);

    client
      .setValue("placeholder='Search papers'", ["paper", client.Keys.ENTER])
      .pause(1000)
      .assert.containsText("class^='articleSearch__articleSearchContainer'", "Night Watch");
  });
});
