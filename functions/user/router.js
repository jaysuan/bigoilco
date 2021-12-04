const admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const { validateFirebaseIdToken, validateRole } = require("../auth/middleware");
const { saveAuditLog } = require("../audit/middleware");

router.use(validateFirebaseIdToken);
router.use(validateRole("Admin"));

router.get("/", async (req, res) => {
    try {
        const results = await admin.auth().listUsers();
        res.json(results.users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in getting users"
        });
    }
});

router.post("/:uid",
    async (req, res, next) => {
        try {
            const uid = req.params.uid;
            const { role } = req.body;
            await admin.auth().setCustomUserClaims(uid, { role });
            const updatedUser = await admin.auth().getUser(uid);
            res.locals.user = updatedUser;
            res.json(updatedUser);
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in updating user"
            });
        }
    },
    saveAuditLog((req, res) => {
        const { email, customClaims } = res.locals.user;
        const { role } = customClaims;
        return `Updated ${email} role to ${role}`;
    })
);

module.exports = router;
