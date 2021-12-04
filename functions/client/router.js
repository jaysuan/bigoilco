const functions = require("firebase-functions");
const express = require("express");
const router = express.Router();

const repository = require("./repository");
const { multipartMiddleware } = require("../upload");
const { checkNewClient, checkClientUpdates } = require("./validation");
const { formatDate, formatDatetime } = require("../util").datetime;
const { validateFirebaseIdToken, validateRole } = require("../auth/middleware");
const { saveAuditLog } = require("../audit/middleware");
const { padID } = require("../util");

const uploadDir = functions.config().googleapi.client.uploaddir;
const multipart = multipartMiddleware(uploadDir);
const checkIfSalesman = validateRole("Salesman");

router.post("/",
    multipart,
    checkNewClient,
    async (req, res, next) => {
        try {
            console.info("Client: \n", req.body);
            const savedRecord = await repository.insert(req.body);
            res.status(201).json(formatClient(savedRecord));
            res.locals.client = savedRecord;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                "message": "Error in getting clients"
            });
        }
    },
    saveAuditLog((req, res) => {
        const { id } = res.locals.client;
        return `New client registered: #${padID(id)}`;
    })
);

router.get("/",
    validateFirebaseIdToken,
    checkIfSalesman,
    async (req, res) => {
        try {
            console.info("Getting all clients");
            const results = await repository.fetchAll();
            res.json(results.map(formatClient));
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": "Error in getting clients"
                });
        }
    }
);

router.patch("/:id",
    validateFirebaseIdToken,
    checkIfSalesman,
    multipart,
    checkClientUpdates,
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const updates = req.body;
            console.info(`Updating client ${id}`);
            const result = await repository.update(id, updates);
            res.locals.clientId = id;
            res.locals.clientUpdates = updates;
            res.json({
                ...result,
                update_values: updates
            });
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                "message": `Error in updating client #${id}`
            });
        }
    },
    saveAuditLog((req, res) => {
        const clientId = res.locals.clientId;
        return `Updated Client #${padID(clientId)}`;
    })
);

function formatClient(client) {
    client.license_expiration = formatDate(client.license_expiration);
    client.date_created = formatDatetime(client.date_created);
    client.date_updated = formatDatetime(client.date_updated);
    return client;
}

module.exports = router;
