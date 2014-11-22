'use strict';

var config = require('konfig')();
var utility = require('../libs/utility.js');
var pouchdb = require('pouchdb');
var DB_URL = config.app.DB_URL;
var STOCK_COUNT_DB = config.app.STOCK_COUNT_DB;
var APP_CONFIG_DB = config.app.APP_CONFIG_DB;
var REMINDER_DB_URL = DB_URL + config.app.REMINDER_DB;
var DAILY = 1;
var WEEKLY = 7;
var BI_WEEKLY = 14;
var MONTHLY = 30;

var getDueDate = function(interval, reminderDay, date){
  var today = new Date();
  var currentDate = date || today;
  var countDate;
  interval = parseInt(interval);

  switch (interval) {
    case DAILY:
      var temp = new Date(currentDate);
      countDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
      break;
    case WEEKLY:
      countDate = utility.getWeekRangeByDate(currentDate, reminderDay).reminderDate;
      if(currentDate.getTime() < countDate.getTime()){
        //current week count date is not yet due, return previous week count date..
        countDate = new Date(countDate.getFullYear(), countDate.getMonth(), countDate.getDate() - interval);
      }
      break;
    case BI_WEEKLY:
      countDate = utility.getWeekRangeByDate(currentDate, reminderDay).reminderDate;
      if (currentDate.getTime() < countDate.getTime()) {
        //current week count date is not yet due, return last bi-weekly count date
        countDate = new Date(countDate.getFullYear(), countDate.getMonth(), countDate.getDate() - interval);
      }
      break;
    case MONTHLY:
      var monthlyDate = (currentDate.getTime() === today.getTime())? 1 : currentDate.getDate();
      countDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), monthlyDate);
      break;
    default:
      throw 'unknown stock count interval.';
  }
  return countDate
};

var addNextDueDate = function(res){
  var result = [];
  res.rows.forEach(function(row){
    row = row.value;
    if(!row.stockCountInterval || !row.reminderDay){
      return false;
    }
    row.nextDueDate = getDueDate(row.stockCountInterval, row.reminderDay, new Date());
    result.push(row);
  });
  return result;
};

var getLatestEvents = function(events){
  var facilityLatestDate = {};
  events.rows.forEach(function(row){
    row = row.value;
    var latestDate = facilityLatestDate[row.facility];
    var eventDate = new Date(row.countDate);
    if(!latestDate || (latestDate <= eventDate)){
      latestDate = eventDate;
    }
    facilityLatestDate[row.facility] = latestDate;
  });
  return facilityLatestDate;
};

var getFacilitiesPending = function(facilities, latestEvents){
  var pendingList = [];
  facilities.forEach(function(row){
    var latestDate = latestEvents[row.facilityId];
    if(!latestDate || ((new Date(latestDate) < new Date(row.nextDueDate)) && (new Date() > new Date(row.nextDueDate)))){
      pendingList.push(row);
    }
  });
  return pendingList;
};

var reminder = {
  getPending: function (d) {
    var date = new Date(d);
    var url = DB_URL + APP_CONFIG_DB;
    var appConfigView = 'app_config/by_facility';
    var appConfigDB = pouchdb(url);

    var scUrl = DB_URL + STOCK_COUNT_DB;
    var scDB = pouchdb(scUrl);
    var scView = 'stockcount/by_countdate_and_facility';
    return appConfigDB.query(appConfigView)
      .then(function(res){
        var facilities = addNextDueDate(res);
        var SINCE_LAST_DAYS = 30;
        var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - SINCE_LAST_DAYS);
        return scDB.query(scView, { startkey: startDate.toJSON() })
          .then(function(res){
            var latestEventDates = getLatestEvents(res);
            return getFacilitiesPending(facilities, latestEventDates);
          });
      });
  },
  getReminderMsg: function(){
    return 'Stock Count is due. Please, use LoMIS to send in your stock count!';
  },
  save: function(reminder){
    var db = new pouchdb(REMINDER_DB_URL);
    return db.post(reminder);
  },
  getByKey: function(key){
    var db = new pouchdb(REMINDER_DB_URL);
    return db.query('reminder/by_facility_reminder_date', { key: key});
  }
};

module.exports = reminder;