const admin = require("firebase-admin");
admin.initializeApp();

module.exports = {
    ...require("./api"),
    ...require("./auth/function")
}
