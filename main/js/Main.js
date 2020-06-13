const max = require("max-api");
const MaxAdapter = require("./MaxAdapter");
const Host = require("./Host");

const host = new Host({}, new MaxAdapter(max));