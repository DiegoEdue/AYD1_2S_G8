const catalog = require("./student-catalog.controller");
const session = require("./student-session.controller");
const profile = require("./student-profile.controller");
const plan = require("./student-plan.controller");

Object.assign(exports, catalog, session, profile, plan);
