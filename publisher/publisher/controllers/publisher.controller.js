const config = require('../../config/env.config.js'),
    callback_api = require('amqplib/callback_api'),
    Joi = require('joi');

const allowed_channels = ["email", "sms", "push"];
// schema options
const schemaOptions = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

function emailSchema(req) {
    // create schema object
    const schema = Joi.object({
        template: Joi.string().required(),
        recipients: Joi.array().min(1).items(Joi.string().email()).required()
    });
    // validate request body against schema
    const {error} = schema.validate(req.body, schemaOptions);
    return error;
}

function smsSchema(req) {
    // create schema object
    const schema = Joi.object({
        message: Joi.string().required(),
        recipients: Joi.array().min(1).items(Joi.string()
            .pattern(new RegExp('^01[0125][0-9]{8}$'))).required()
    });
    // validate request body against schema
    const {error} = schema.validate(req.body, schemaOptions);
    return error;
}

function pushSchema(req) {
    // create schema object
    const schema = Joi.object({
        message: Joi.string().required(),
        tokens: Joi.array().min(1).items(Joi.string()).required()
    });
    // validate request body against schema
    const {error} = schema.validate(req.body, schemaOptions);
    return error;
}


function bail(error) {
    // kill process
    process.exit(1);
}

// Publisher
function publisher(conn, channel, msg) {
    // create broker channel
    conn.createChannel(on_open);

    function on_open(error, ch) {
        if (error != null) bail(error);
        ch.assertQueue(channel);
        // send message using the queue
        console.log("Publisher msg ======", msg)
        ch.sendToQueue(channel, Buffer.from(JSON.stringify(msg)), {persistent: true});
    }
}

exports.validate = (req, res, next) => {
    // check if params is on of email, sms, push notification
    if (!allowed_channels.includes(req.params.channel)) {
        // return error status and message
        res.status(422).send({
            "channel_error": `Invalid Channel ${req.params.channel}`
        });
    } else {
        let error;
        // validate schema based channel
        if (req.params.channel === "email") {
            error = emailSchema(req);
        } else if (req.params.channel === "sms") {
            error = smsSchema(req);
        } else if (req.params.channel === "push") {
            error = pushSchema(req);
        }
        if (error) {
            // return error status and message
            res.status(422).send({
                "validation_error": ` ${error.details.map(x => x.message).join(', ')}`
            });
        } else {
            next();
        }
    }
};

exports.sendResponse = (req, res, next) => {
    // response with default message
    res.send({
        "notification_status": "initiated"
    });
    next();
};

exports.publish = function (req) {
    // connect to rabbit mq
    callback_api.connect(config.rabbitmqEndpoint, function (error, conn) {
        if (error != null) bail(error);
        publisher(conn, req.params.channel, req.body);
    });
};




