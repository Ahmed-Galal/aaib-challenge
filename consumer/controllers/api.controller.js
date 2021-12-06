const config = require('../config/env.config.js'),
    axios = require('axios');

exports.sendEmail = async (template, recipients) => {
    // send email and update notification status
    console.log("send EMAIL template", template);
    console.log("send EMAIL recipients", recipients);
};
exports.sendSMS = async (message, recipients) => {
    // send SMS and update notification status
    console.log("send SMS message", message);
    console.log("send SMS recipients", recipients);
};
exports.sendPushNotification = async (message, tokens) => {
    // send push notificaiton and update notification status
    console.log("send PUSH message", message);
    console.log("send PUSH tokens", tokens);
};
