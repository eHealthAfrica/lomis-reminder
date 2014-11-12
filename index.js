'use strict';

var reminder = require('./libs/reminder.js');
var smsClient = require('./libs/sms-client.js');
var logger = require('./libs/logger.js');
console.log(logger);

var DAILY_INTERVAL = 86400000;//24 hours in milliseconds
var reminderMsg = reminder.getReminderMsg();

function sendPendingReminders(){
  reminder.getPending(new Date())
    .then(function(res){
      res.forEach(function(row){
        if(!row.phoneNo || row.phoneNo.length === 0){
          logger.warn('Phone No not available for Facility: '+row.facilityId);
          return;
        }
        smsClient.send(row.phoneNo, reminderMsg)
          .then(function(res){
            logger.info('Reminder sent to: ' + row.facilityId);
            //TODO: check if a reminder has been sent for the given period.
          })
          .catch(function(err){
            var errMsg = [
              'Reminder Failed, Recipient:', row.facilityId,
              'Reason: ', JSON.stringify(err)
            ].join(' ');
            logger.error(errMsg);
          })
      });
    })
    .catch(function(err) {
      logger.error(err);
    });
}

function main(){
  setInterval(sendPendingReminders, DAILY_INTERVAL);
}

main();
