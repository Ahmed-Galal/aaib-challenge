publishController = require('./controllers/publisher.controller');

exports.routesConfig = function (app) {

        app.post('/:channel', [
        publishController.validate,
        publishController.sendResponse,
        publishController.publish
    ]);

};


