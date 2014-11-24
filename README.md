lomis-reminder
==============

A Cron Job script that runs at interval and send SMS alerts to designated recipients to remind them of events/actions that are due (stock count, etc).

## Configuration set up
This script requires a configuration file, app.json place at:

`ROOT_FOLDER/config/app.json`

with following:

`{`
  `"default": {`
    `"DB_URL": "",`
    `"STOCK_COUNT_DB": "",`
    `"APP_CONFIG_DB": "",`
    `"SMS_URI": "",`
    `"PHONE_ID": "",`
    `"API_KEY": "",`
    `"REMINDER_DB": "sms_reminders"`
  `}`
`}`


## Usage

0. Install [Node.js][] and [Git][]
1. `npm install -g grunt-cli`
2. `git clone https://github.com/eHealthAfrica/lomis-reminder.git`
3. `cd lomis-reminder && npm install;`
4. `Create design docs inside couchdbviews on the database server`
5. `node index.js`

[Node.js]: http://nodejs.org
[Git]: http://git-scm.com

## Testing

Use `grunt test` for the complete test suite.

### Unit

1. `grunt test`

## Author

© 2014 [eHealth Systems Africa](http://ehealthafrica.org)