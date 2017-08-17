'use strict';

const _ = require('lodash');
const Axios = require('axios');
const QueryString = require('querystring');

class Client {

    constructor(user, pass) {
        this.user = user;
        this.pass = pass;

        this._httpClient = Axios.create({
            baseURL: 'https://smsapi.free-mobile.fr/'
        });
    }

    // Send a text message by SMS (using Free operator in France)
    sendSMS(message) {
        if(typeof this.user !== 'undefined' && typeof this.pass !== 'undefined'){
            const url = 'sendmsg?' + QueryString.stringify({
                user: this.user,
                pass: this.pass,
                msg: message
            });
            return this._httpClient({
                method: 'GET',
                url: url
            }).then(response => {
                return response.data;
            });
        } else
            return console.error("Please, if you have an account with Free mobile operator, visit your account and refer your 'user' and 'pass' in the free client constructor in order to receive SMS alerts.");
    }
}

module.exports = Client;