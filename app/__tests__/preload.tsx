const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

Enzyme.configure({ adapter: new Adapter() });

Object.defineProperty(window.location, "host", {
  writable: true,
});

Object.defineProperty(window.location, "hostname", {
  writable: true,
});
