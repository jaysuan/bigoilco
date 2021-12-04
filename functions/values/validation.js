const { param, validationResult } = require("express-validator");

const resultMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    next();
}

const checkValueType = [
    param("type").notEmpty()
        .isIn(["sales_rep", "output_consistency", "deal", "crc"])
        .withMessage("Invalid type"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

module.exports = {
    checkValueType
}
