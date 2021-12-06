const axios = require('axios');
const expect = require('chai').expect;

const sendNotification = (channel, body) => {
    return axios
        .post(`http://localhost/${channel}`, body)
        .then(res => {
            return res
        })
        .catch(error => {
            if (error.response) {
                return error.response;
            }
        });
}


describe('Publish SMS Message', () => {
    it('Publish valid Message and valid recipients', () => {
        return sendNotification('sms', {
            "message": "the transfer has been submitted",
            "recipients": [
                "01006736720",
                "01006736720",
            ]
        })
            .then(res => {
                expect(res.status).to.equal(200);
                expect(typeof res.data).to.equal('object');
                expect(res.data.notification_status).to.equal('initiated');
            });
    });
    it('Publish valid Message and not valid recipients', () => {
        return sendNotification('sms', {
            "message": "the transfer has been submitted",
            "recipients": [
                "not valid number"
            ]
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('fails to match the required');
            });
    });
    it('Publish valid Message and  empty recipients', () => {
        return sendNotification('sms', {
            "message": "the transfer has been submitted",
            "recipients": []
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('"recipients" must contain at least 1 items');
            });
    });
    it('Publish missing message key valid recipients', () => {
        return sendNotification('sms', {
            "recipients": [
                "01006736720"
            ]
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('"message" is required');
            });
    });
});

describe('Publish Email Message', () => {
    it('Publish valid template and valid recipients', () => {
        return sendNotification('email', {
            "template": "<strong> the transfer has been submitted</strong>",
            "recipients": [
                "a.galal.atia@gmail.com"
            ]
        })
            .then(res => {
                expect(res.status).to.equal(200);
                expect(typeof res.data).to.equal('object');
                expect(res.data.notification_status).to.equal('initiated');
            });
    });
    it('Publish valid template and empty recipients', () => {
        return sendNotification('email', {
            "template": "<strong> the transfer has been submitted</strong>",
            "recipients": []
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('"recipients" must contain at least 1 items');
            });
    });
    it('Publish valid template and not valid recipients', () => {
        return sendNotification('email', {
            "template": "<strong> the transfer has been submitted</strong>",
            "recipients": [
                "not valid email"
            ]
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('must be a valid email');
            });
    });
    it('Publish missing template key valid recipients', () => {
        return sendNotification('email', {
            "recipients": [
               "a.galal.atia@gmail.com"
            ]
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('"template" is required');
            });
    });
});


describe('Publish Push Message', () => {
    it('Publish valid message and valid tokens', () => {
        return sendNotification('push', {
            "message": "the transfer has been submitted",
            "tokens": [
                "a.galal.atia@gmail.com"
            ]
        })
            .then(res => {
                expect(res.status).to.equal(200);
                expect(typeof res.data).to.equal('object');
                expect(res.data.notification_status).to.equal('initiated');
            });
    });
    it('Publish valid message and empty tokens', () => {
        return sendNotification('push', {
            "message": "the transfer has been submitted",
            "tokens": []
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('"tokens" must contain at least 1 items');
            });
    });
    it('Publish valid message and not valid tokens', () => {
        return sendNotification('push', {
            "message": "the transfer has been submitted",
            "tokens": [
                44444444,
                34553454
            ]
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('must be a string');
            });
    });
    it('Publish missing message key valid tokens', () => {
        return sendNotification('push', {
            "tokens": [
               "a.galal.atia@gmail.com"
            ]
        })
            .then(res => {
                expect(res.status).to.equal(422);
                expect(res.data.validation_error).to.contain('"message" is required');
            });
    });
});


