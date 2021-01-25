let user = require('./users');
let image = require('./image');
let policy = require('./policy');

module.exports.setRoutes = function (app) {
    user.setRoutes(app);
    image.setRoutes(app);
    policy.setRoutes(app);
};