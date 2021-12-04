const express = require("express");
const router = express.Router();
const repository = require("./repository");
const { checkBhoPackage } = require("./validation");
const { validateFirebaseIdToken, validateRole } = require("../auth/middleware");
const { toDefaultTimezone } = require("../util").datetime;

router.use(validateFirebaseIdToken);
router.use(validateRole("Processor"));

router.get("/topack", async (req, res) => {
    try {
        const results = await repository.fetchItemsToPack();
        res.json(results.map(formatIntakeItem));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in getting items for BHO packaging"
        });
    }
});

router.post("/pack",
    checkBhoPackage,
    async (req, res) => {
        try {
            const { intake_item_id, package } = req.body;
            
            // fetch intake item
            const intakeItem = await repository.fetchItemById(intake_item_id);

            if (!intakeItem) {
                res.status(400).json({
                    message: "Invalid intake item ID"
                });
                return;
            }

            if (package.total_weight_grams > intakeItem.qty_grams) {
                res.status(400).json({
                    message: "Pack total weight larger than item's remaining weight"
                });
                return;
            }

            // calculate remaining weight
            const remainingWeightGrams = intakeItem.qty_grams - package.total_weight_grams;
            const remainingWeightLbs = remainingWeightGrams * 0.00220462;

            // save package
            const savedItem = await repository.insert(package, {
                qty_grams: remainingWeightGrams,
                qty_lbs: remainingWeightLbs,
                id: intake_item_id
            });
            res.status(201).json(savedItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in saving new BHO package"
            });
        }
    }
);

const formatIntakeItem = (item) => {
    item.pack_priority = !!item.pack_priority;
    item.date_created = toDefaultTimezone(item.date_created);
    return item;
}

module.exports = router;
