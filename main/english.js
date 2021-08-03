let greetings = require('./greetings.json');

let green = function () {
    console.log(greetings.en);
}

module.exports = green;