const repository = require("./repository");

const saveAuditLog = (actionProducer) => async (req, res, next) => {
    try {
        const { name, email } = req.user;
        await repository.insert({
            name,
            email,
            action: actionProducer(req, res)
        });
    } catch (error) {
        console.error("Error while saving audit log: ", error);
    }
    next();
}

module.exports = {
    saveAuditLog
}
