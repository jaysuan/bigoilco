const { query, validationResult } = require("express-validator");

const resultMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    next();
}

const checkQueryParams = [
    query("page").optional({ nullable: true, checkFalsy: true }).isInt({ gt: 0 }),
    query("resultsPerPage").optional({ nullable: true, checkFalsy: true }).isInt({ gt: 0 }),
    resultMiddleware
]

module.exports = {
    checkQueryParams
}
