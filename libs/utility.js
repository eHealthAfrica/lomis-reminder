'use strict';

var utility = {
  getWeekRangeByDate: function (date, reminderDay) {
    var currentDate = date;
    // First day of current week is assumed to be Sunday, if current date is
    // 19-12-2014, which is Thursday = 4, then date of first day of current week
    // = 19 - 4 = 15-12-2014 which is Sunday
    var firstDayOfCurrentWeek = currentDate.getDate() - currentDate.getDay();
    var FIRST_DAY_AND_LAST_DAY_DIFF = 6;
    var lastDayOfCurrentWeek = firstDayOfCurrentWeek +
      FIRST_DAY_AND_LAST_DAY_DIFF;
    var firstDayDateOfCurrentWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      firstDayOfCurrentWeek, 0, 0, 0
    );
    var lastDayDateOfCurrentWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      lastDayOfCurrentWeek, 0, 0, 0
    );
    var reminderDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      firstDayOfCurrentWeek + reminderDay, 0, 0, 0
    );
    return {
      'first': firstDayDateOfCurrentWeek,
      'last': lastDayDateOfCurrentWeek,
      'reminderDate': reminderDate
    };
  }
};

module.exports = utility;
