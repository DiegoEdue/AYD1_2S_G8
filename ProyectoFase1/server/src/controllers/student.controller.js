const catalog = require("./student-catalog.controller");
const session = require("./student-session.controller");
const profile = require("./student-profile.controller");

Object.assign(exports, catalog, session, profile);
