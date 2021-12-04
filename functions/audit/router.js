const express = require("express");
const router = express.Router();
const repository = require("./repository");
const { validateFirebaseIdToken, validateRole } = require("../auth/middleware");
const { checkQueryParams } = require("./validation");
const { toDefaultTimezone } = require("../util").datetime;

router.use(validateFirebaseIdToken);
router.use(validateRole("Admin"));

router.get("/",
    checkQueryParams,
    async (req, res) => {
        try {
            const page = req.query.page;
            let results;
            if (page) {
                let resultsPerPage = req.query.resultsPerPage;
                if (!resultsPerPage)
                    resultsPerPage = 100;
                results = await repository.fetch({ page, resultsPerPage });
            } else {
                results = await repository.fetchAll();
            }
            res.json(results.map(formatAuditLogs));
        } catch (error) {
            console.error(error);
            res.status(500).json({
                "message": "Error in getting audit logs"
            });
        }
    }
);

const formatAuditLogs = (auditLog) => {
    auditLog.date_created = toDefaultTimezone(auditLog.date_created);
    return auditLog;
}

module.exports = router;
