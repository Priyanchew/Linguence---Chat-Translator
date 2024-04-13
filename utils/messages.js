// dependencies
const moment = require('moment-timezone');
const translateText = require('./translation');
async function formatMessage(username, text, language) {
    console.log(text);
    const translatedText = await translateText(text, language)
    console.log(translatedText);
    return {
        username,
        translatedText,
        // time: moment().format('h:mm a'),
        time: moment().tz('Asia/Kolkata').format('h:mm a'),
    };
}

module.exports = formatMessage;
