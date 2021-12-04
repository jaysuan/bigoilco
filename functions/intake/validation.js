const { body, validationResult } = require("express-validator");
const { toUTC } = require("../util").datetime;

function checkDate(prop) {
    return body(prop)
        .isDate({format: "MM/DD/YYYY"})
        .withMessage("Invalid date format. Use MM/DD/YYYY.")
        .customSanitizer(toUTC);
}

const resultMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    next();
}

const checkNewIntake = [
    body("client_id").isInt(),
    body("sales_rep_id").isInt(),
    body("origin_dba").notEmpty(),
    body("origin_license_name").notEmpty(),
    body("origin_license_num").notEmpty(),
    body("type").notEmpty().isIn(["Pickup", "Drop Off"]),
    checkDate("delivery_date").optional({ nullable: true }),
    checkDate("pickup_date").optional({ nullable: true }),
    body("deal").notEmpty(),

    resultMiddleware
];

const checkScheduledPickupUpdate = [
    body().isArray().withMessage("Body must be an array"),
    body("*.id").isInt().toInt(),
    checkDate("*.scheduled_pickup_date"),

    resultMiddleware
];

const checkActualPickupUpdate = [
    body().isArray().withMessage("Body must be an array"),
    body("*.id").isInt().toInt(),
    checkDate("*.actual_pickup_date"),

    resultMiddleware
];

const checkIntakeFromManager = [
    body("id").isInt(),
    body("manifest_num").isArray().notEmpty(),
    body("items").isArray().notEmpty(),
    body("items.*.metrc_uid").isLength(25),
    body("items.*.metrc_qty_grams").isDecimal(),
    body("items.*.received_qty_grams").isDecimal(),
    body("items.*.metrc_received_discrepancy_grams").isDecimal(),
    body("items.*.metrc_received_discrepancy_perc").isDecimal(),
    body("items.*.item_type").isIn(["SKU", "Mix", "Ingredient"]),
    body("items.*.final_sku_or_mix").notEmpty(),
    body("items.*.lot_num").notEmpty(),

    resultMiddleware
]

module.exports = {
    checkNewIntake,
    checkScheduledPickupUpdate,
    checkActualPickupUpdate,
    checkIntakeFromManager
}
