const { body, param, validationResult } = require("express-validator");
const { toUTC } = require("../util").datetime;

const resultMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    next();
}

const checkNewClient = [
    body("email").notEmpty().isEmail(),
    body("sales_rep_id").notEmpty().isInt().toInt(),
    body("licensed_business_name").notEmpty(),
    body("doing_business_as").notEmpty(),
    body("completed_w9").isURL()
        .withMessage("Completed W9 is required"),
    body("license_num").notEmpty(),
    body("license_file_1").isURL()
        .withMessage("License File is required"),
    body("cdtfa_seller_permit_file").isURL()
        .withMessage("CDTFA Seller Permit File is required"),
    body("cdtfa_seller_permit_num").notEmpty(),
    body("license_types").notEmpty(),
    body("license_expiration").isDate({ format: "MM/DD/YYYY" })
        .withMessage("Invalid date format. Use MM/DD/YYYY.")
        .customSanitizer(toUTC),
    body("license_address").notEmpty(),
    body("license_address_city").notEmpty(),
    body("license_address_state").notEmpty(),
    body("license_address_zip").notEmpty(),
    body("main_contact_name").notEmpty(),
    body("main_contact_title").notEmpty(),
    body("main_contact_phone").notEmpty(),
    body("delivery_pickup_contact_name").optional({ nullable: true, checkFalsy: true }),
    body("delivery_pickup_contact_phone").optional({ nullable: true, checkFalsy: true }),
    body("delivery_pickup_contact_email").optional({ nullable: true, checkFalsy: true }).isEmail(),
    body("delivery_pickup_constraints").optional({ nullable: true, checkFalsy: true }),
    body("metrc_contact_phone").optional({ nullable: true, checkFalsy: true }),
    body("metrc_contact_email").optional({ nullable: true, checkFalsy: true }).isEmail(),
    body("accounting_full_name").optional({ nullable: true, checkFalsy: true }),
    body("accounting_phone").optional({ nullable: true, checkFalsy: true }),
    body("accounting_email").optional({ nullable: true, checkFalsy: true }).isEmail(),
    body("accounting_instructions").optional({ nullable: true, checkFalsy: true }),
    body("products_interested").notEmpty(),
    resultMiddleware
];

const checkClientUpdates = [
    param("id").isInt().toInt().withMessage("Invalid Client ID"),
    body("email").optional({ nullable: true, checkFalsy: true }).isEmail(),
    body("sales_rep_id").optional({ nullable: true, checkFalsy: true }).isInt().toInt(),
    body("licensed_business_name").optional({ nullable: true, checkFalsy: true }),
    body("doing_business_as").optional({ nullable: true, checkFalsy: true }),
    body("completed_w9").optional({ nullable: true, checkFalsy: true }).isURL(),
    body("license_num").optional({ nullable: true, checkFalsy: true }),
    body("license_file_1").optional({ nullable: true, checkFalsy: true }).isURL(),
    body("cdtfa_seller_permit_file").optional({ nullable: true, checkFalsy: true }).isURL(),
    body("cdtfa_seller_permit_num").optional({ nullable: true, checkFalsy: true }),
    body("license_types").optional({ nullable: true, checkFalsy: true }),
    body("license_expiration").optional({ nullable: true, checkFalsy: true })
        .isDate({ format: "MM/DD/YYYY" })
        .withMessage("Invalid date format. Use MM/DD/YYYY.")
        .customSanitizer(toUTC),
    body("license_address").optional({ nullable: true, checkFalsy: true }),
    body("license_address_city").optional({ nullable: true, checkFalsy: true }),
    body("license_address_state").optional({ nullable: true, checkFalsy: true }),
    body("license_address_zip").optional({ nullable: true, checkFalsy: true }),
    body("main_contact_name").optional({ nullable: true, checkFalsy: true }),
    body("main_contact_title").optional({ nullable: true, checkFalsy: true }),
    body("main_contact_phone").optional({ nullable: true, checkFalsy: true }),
    body("delivery_pickup_contact_name").optional({ nullable: true, checkFalsy: true }),
    body("delivery_pickup_contact_phone").optional({ nullable: true, checkFalsy: true }),
    body("delivery_pickup_contact_email").optional({ nullable: true, checkFalsy: true }).isEmail(),
    body("delivery_pickup_constraints").optional({ nullable: true, checkFalsy: true }),
    body("metrc_contact_phone").optional({ nullable: true, checkFalsy: true }),
    body("metrc_contact_email").optional({ nullable: true, checkFalsy: true }).isEmail(),
    body("accounting_full_name").optional({ nullable: true, checkFalsy: true }),
    body("accounting_phone").optional({ nullable: true, checkFalsy: true }),
    body("accounting_email").optional({ nullable: true, checkFalsy: true }).isEmail(),
    body("accounting_instructions").optional({ nullable: true, checkFalsy: true }),
    body("products_interested").optional({ nullable: true, checkFalsy: true }),
    resultMiddleware
]

module.exports = {
    checkNewClient,
    checkClientUpdates
}
