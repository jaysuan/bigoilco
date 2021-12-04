const moment = require("moment-timezone");

const dateFmt = "MM/DD/YYYY";
const dateTimeFmt = "MM/DD/YYYY HH:mm:ss"
const defaultTimezone = "America/Los_Angeles";

function formatDate(date, format) {
    return date ? moment(date).format(format || dateFmt) : null;
}

function formatDatetime(date, format) {
    return date ? moment(date).format(format || dateTimeFmt) : null;
}

/**
 * Converts date string to UTC @type {Date}
 * 
 * @param {string} datetime MM/DD/YYYY format (e.g. 02/08/2021)
 */
function toUTC(datetime) {
    return datetime
        ? moment.tz(datetime, dateTimeFmt, defaultTimezone).utc(true).toDate()
        : null;
}

function toDefaultTimezone(datetime) {
    return datetime
        ? moment.utc(datetime).tz(defaultTimezone).format(dateTimeFmt)
        : null;
}

exports.datetime = {
    toUTC,
    toDefaultTimezone,
    formatDate,
    formatDatetime
}
