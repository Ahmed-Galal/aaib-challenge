const config = require('./config/env.config.js'),
    callback_api = require('amqplib/callback_api'),
    redisController = require('./controllers/redis.controller'),
    apiController = require('./controllers/api.controller');

const requestLimitPerMinuite = {
    "sms": 10,
    "email": 5
};

function getBlockPeriod(request_number_per_minute) {
    // get blocked time period
    return 60 / request_number_per_minute;
}

function bail(err) {
    console.error(err);
    // process.exit(1);
}


// Consumer
function consumer(conn) {
    conn.createChannel(on_open);

    function on_open(err, ch) {
        if (err != null) bail(err);
        // ============= sms queue =======
        ch.assertQueue('sms');
        ch.consume('sms', function (msg) {
            if (msg !== null) {
                // set new time for sms key
                redisController.setKey('sms', getBlockPeriod(requestLimitPerMinuite.sms)).then((result) => {
                    if (result) {
                        let body = JSON.parse(msg.content.toString());
                        // send sms to recipients
                        apiController.sendSMS(body.message, body.recipients).then(() => {
                            try {
                                // mark message as acknowladge
                                ch.ack(msg);
                            } catch (error) {
                                console.log("error ack", error);
                            }
                        }).catch((error) => {
                            console.log("error ", error);
                        });
                    } else {
                        // let gr = ch.BasicGet('sms',false);
                        ch.nack(msg,false, true)
                        // console.log(" sms request blocked : ", result);
                    }
                });
            }
        }, {noAck: false});
        //========== email queue ======
        ch.assertQueue('email');
        ch.consume('email', function (msg) {
            if (msg !== null) {
                // get last email time from caching
                redisController.getKey('email').then((lastSMSTime) => {
                    // validate block time for email request
                    if (!lastSMSTime || new Date().getTime() >= lastSMSTime) {
                        // set new time for email key
                        redisController.setKey('email', getBlockPeriod(requestLimitPerMinuite.sms));
                        let body = JSON.parse(msg.content.toString());
                        // send email to recipients
                        apiController.sendEmail(body.template, body.recipients).then(() => {
                            try {
                                // mark message as acknowladge
                                ch.ack(msg);
                            } catch (error) {
                                console.log("error ack ", error);
                            }
                        }).catch((error) => {
                            console.log("error ", error);
                        });
                    } else {
                        console.log(" sms request blocked");
                    }
                });
            }
        });
        //=================  push queue ======
        ch.assertQueue('push');
        ch.consume('push', function (msg) {
            if (msg !== null) {
                let body = JSON.parse(msg.content.toString());
                // send push notifications to tokens
                apiController.sendPushNotification(body.message, body.tokens).then(() => {
                    try {
                        // mark message as acknowladge
                        ch.ack(msg);
                    } catch (error) {
                        console.log("error ack ", error);
                    }
                }).catch((error) => {
                    console.log("error ", error);
                });
            }
        });
    }
}

callback_api.connect(config.rabbitmqEndpoint, function (err, conn) {
    if (err != null) bail(err);
    else consumer(conn);
});
