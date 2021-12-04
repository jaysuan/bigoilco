const functions = require("firebase-functions");
const express = require("express");
const router = express.Router();
const { formatDate, toDefaultTimezone } = require("../util").datetime;
const repository = require("./repository");
const {
    checkNewIntake,
    checkScheduledPickupUpdate,
    checkActualPickupUpdate,
    checkIntakeFromManager
} = require("./validation");
const { notifyDispatchers, notifyIntakeManagers } = require("../notification");
const workOrderRepository = require("../work-order/repository");
const { validateFirebaseIdToken, validateRole } = require("../auth/middleware");
const { saveAuditLog } = require("../audit/middleware");
const { padID } = require("../util");

const checkIfSalesman = validateRole("Salesman");
const checkIfEmployee = validateRole("Employee");

router.use(validateFirebaseIdToken);

router.post("/",
    checkIfSalesman,
    checkNewIntake,
    async (req, res, next) => {
        try {
            const intake = req.body;
            console.info("Intake: ", intake);
            const newIntake = await repository.insert({
                ...intake,
                intake_status: intake.type === "Pickup" ? "Dispatcher" : "Intake-Manager"
            });
            res.locals.intake = newIntake;
            res.status(201)
                .location(`${req.baseUrl}/${newIntake.id}`)
                .json(resultMapper(newIntake));
            next();
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": "Error in saving new intake"
                });
        }
    },
    saveAuditLog((req, res) => {
        const { id } = res.locals.intake;
        return `New intake saved with ID #${padID(id)}`;
    }),
    slackNotificationMiddleware((req, res) => {
        const intake = res.locals.intake;
        const { type, intake_status } = intake;
        if (intake_status === "Dispatcher") {
            return notifyDispatchers(intake);
        } else {
            return notifyIntakeManagers(1, type);
        }
    })
);

// TODO: determine what role
router.get("/", async (req, res) => {
    try {
        console.info("Getting intakes");
        const statusFilter = req.query.status;
        let results;
        if (statusFilter) {
            results = await repository.fetch({
                intake_status: statusFilter
            });
        } else {
            // fetch all
            results = await repository.fetchAll();
        }
        res.json(results.map(resultMapper));
    } catch (error) {
        console.error(error);
        res.status(500)
            .json({
                "message": "Error in getting intakes"
            });
    }
});

router.get("/dispatch/pickup",
    checkIfEmployee,
    async (req, res) => {
        try {
            const results = await repository.fetchIntakesForPickup("Dispatcher");
            res.json(results.map(resultMapper));
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": "Error in getting intakes for pickup"
                });
        }
    }
);

router.get("/dispatch/pickup/schedule",
    checkIfEmployee,
    async (req, res) => {
        try {
            const results = await repository.fetchIntakesForPickup("Dispatcher-Scheduled");
            res.json(results.map(resultMapper));
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": "Error in getting intakes with scheduled pickup"
                });
        }
    }
);

router.post("/dispatch/pickup/schedule",
    checkIfEmployee,
    checkScheduledPickupUpdate,
    async (req, res, next) => {
        try {
            const intakeUpdates = req.body;
            const updates = intakeUpdates.map(update => {
                update.intake_status = "Dispatcher-Scheduled";
                return update;
            });
            const result = await repository.updateMany(updates);
            res.json({
                ...result,
                update_values: updates
            });
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                "message": "Error in setting scheduled pickup date of intakes"
            });
        }
    },
    saveAuditLog((req, res) => {
        return "Set scheduled pickup date(s)";
    })
);

router.post("/dispatch/pickup/actual",
    checkIfEmployee,
    checkActualPickupUpdate,
    async (req, res, next) => {
        try {
            const intakeUpdates = req.body;
            const updates = intakeUpdates.map(update => {
                update.intake_status = "Intake-Manager";
                return update;
            });
            const result = await repository.updateMany(updates);
            res.locals.numOfIntakes = updates.length;
            res.json({
                ...result,
                update_values: updates
            });
            next();
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": "Error in setting actual pickup date of intakes"
                });
        }
    },
    saveAuditLog((req, res) => {
        return "Set actual pickup date(s)";
    }),
    slackNotificationMiddleware((_, res) => notifyIntakeManagers(res.locals.numOfIntakes, "Pickup"))
);

router.get("/manager",
    checkIfEmployee,
    async (req, res) => {
        try {
            console.info("Getting intakes for Intake Manager");
            const results = await repository.fetchIntakesForManager();
            res.json(results.map(resultMapper));
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": "Error in getting intakes"
                });
        }
    }
);

router.post("/manager",
    checkIfEmployee,
    checkIntakeFromManager,
    async (req, res, next) => {
        try {
            const intake = req.body;
            intake.intake_status = "Processing";
            console.info("Updates: ", intake);
            const result = await repository.update(intake);
            const { items } = await repository.fetchById(intake.id);
            const workOrders = items.filter(item => item.item_type == "SKU" || item.item_type == "Mix")
                .map(item => ({ item_id: item.id }));
            const workOrderResults = await workOrderRepository.insertMany(workOrders);
            console.info(`New work orders: ${workOrderResults}`);
            res.locals.intake = intake;
            res.json({
                ...result,
                update_values: intake
            });
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                "message": "Error in saving intake from Intake Manager"
            });
        }
    },
    saveAuditLog((req, res) => {
        const { id } = res.locals.intake;
        return `Intake #${padID(id)} submitted for processing`;
    })
);

router.post("/manager/draft",
    checkIfEmployee,
    async (req, res, next) => {
        try {
            console.info("Saving intake draft");
            const updates = req.body;
            updates.intake_status = "Intake-Manager-Draft";
            console.info("Intake draft updates: ", updates);
            const result = await repository.update(updates);
            res.locals.intakeUpdates = updates;
            res.json({
                ...result,
                update_values: updates
            });
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                "message": "Error in saving intake draft"
            });
        }
    },
    saveAuditLog((req, res) => {
        const { id } = res.locals.intakeUpdates;
        return `Intake #${padID(id)} draft saved`;
    })
);

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.info(`Getting intake #${id}`);
        const result = await repository.fetchById(id);
        if (result)
            res.json(resultMapper(result));
        else
            res.status(404).json({
                "message": `No intake with ID ${id}`
            });
    } catch (error) {
        console.error(error);
        res.status(500)
            .json({
                "message": "Error in getting intake"
            });
    }
});

function slackNotificationMiddleware(notifier) {
    if (!functions.config().slack.enable)   // return a no-op middleware
        return (req, res) => {};
    return async (req, res) => {
        console.info("Sending Slack notification");
        try {
            await notifier(req, res);
        } catch (error) {
            console.error("Error in sending Slack notification: ", error);
        }
    }
}

function resultMapper(intake) {
    intake.delivery_date = formatDate(intake.delivery_date);
    intake.pickup_date = formatDate(intake.pickup_date);
    intake.scheduled_pickup_date = formatDate(intake.scheduled_pickup_date);
    intake.actual_pickup_date = formatDate(intake.actual_pickup_date);
    intake.date_created = toDefaultTimezone(intake.date_created);
    intake.date_updated = toDefaultTimezone(intake.date_updated);
    return intake;
}

module.exports = router;
