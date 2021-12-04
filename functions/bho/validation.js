const { body, validationResult } = require("express-validator");
const { toUTC } = require("../util").datetime;

const resultMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    next();
}

const checkBhoPackage = [
    body("intake_item_id").isInt().toInt(),
    body("package.ancestor_metrc_uids")
        .isArray()
        .customSanitizer(value => value.join(",")),
    body("package.pack_date").customSanitizer(toUTC),
    resultMiddleware
]

module.exports = {
    checkBhoPackage
}
