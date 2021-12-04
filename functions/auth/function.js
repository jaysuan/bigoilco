const functions = require("firebase-functions");
const admin = require("firebase-admin");

const initialAdminEmail = functions.config().auth.admin;

exports.assignDefaultRole = functions.auth.user().onCreate(async (user) => {
    console.info(`New user created: ${user.email}`);
    let role;
    if (user.email === initialAdminEmail)
        role = "Admin";
    else
        role = "Viewer";
    await admin.auth().setCustomUserClaims(user.uid, { role });
});
