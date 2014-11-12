'use strict';

var LOG_CATEGORY = 'lomis-reminder';
var log4js = require('log4js');
var logFile = LOG_CATEGORY+'.log'
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: logFile, category: LOG_CATEGORY }
  ]
});

module.exports = log4js.getLogger(LOG_CATEGORY);