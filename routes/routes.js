let user = require('./users');
let image = require('./image.js');

module.exports.setRoutes = function (app) {
    user.setRoutes(app);
    image.setRoutes(app);
};