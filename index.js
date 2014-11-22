'use strict';

var reminder = require('./libs/reminder.js');
var smsClient = require('./libs/sms-client.js');
var logger = require('./libs/logger.js');

var DAILY_INTERVAL = 14400000;//4 hours in milliseconds
var reminderMsg = reminder.getReminderMsg();

function sendPendingReminders() {
  reminder.getPending(new Date())
    .then(function (res) {
      res.forEach(function (row) {
        if (!row.phoneNo || row.phoneNo.length === 0) {
          logger.warn('Phone No not available for Facility: ' + row.facilityId);
          return;
        }
        var today = new Date();
        var datePart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toJSON();
        var key = row.facilityId + datePart;
        reminder.getByKey(key)
          .then(function (res) {
            if (res.rows.length === 0) {
              smsClient.send(row.phoneNo, reminderMsg)
                .then(function () {
                  logger.info('Reminder sent to: ' + row.facilityId + ', Phone No: ' + row.phoneNo);
                  var doc = {
                    info: row,
                    type: 'stock_count',
                    sentOn: datePart
                  };
                  reminder.save(doc);
                })
                .catch(function (err) {
                  var errMsg = [
                    'Reminder Failed, Recipient:', row.facilityId,
                    'Reason: ', JSON.stringify(err)
                  ].join(' ');
                  logger.error(errMsg);
                });
            } else {
              logger.info('Reminder already sent for today. Facility: ' + row.facilityId);
            }
          });
      });
    })
    .catch(function (err) {
      logger.error(err);
    });
}

function main() {
  setInterval(sendPendingReminders, DAILY_INTERVAL);
}

main();
