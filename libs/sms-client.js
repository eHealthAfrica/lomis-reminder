'use strict';

var request = require('request');
var config = require('konfig')();
var q = require('q');

var smsOptions = {
  "phone_id": config.app.PHONE_ID,
  "to_number": '',
  "content": '',
  "api_key": config.app.API_KEY
};
var SMS_URI = config.app.SMS_URI;

var smsClient = {
  send: function (recipient, msg, reqOptions) {
    var deferred = q.defer();
    var opts = {
      method: "POST",
      json: smsOptions,
      uri: SMS_URI
    };
    if(reqOptions){
      opts = reqOptions;
    }
    opts.json.to_number = recipient;
    opts.json.content = msg;
    request(opts, function(err, res, body) {
      if (res) {
        deferred.resolve(res.body);
      } else {
        deferred.reject(err);
      }
    });
    return deferred.promise;
  }
};

module.exports = smsClient;