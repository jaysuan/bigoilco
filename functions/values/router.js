const express = require("express");
const router = express.Router();

const salesRepRepository = require("./salesRepRepository");
const nameValuesRepository = require("./nameValuesRepository");
const { checkValueType } = require("./validation");

router.get("/batch", async (req, res) => {
    try {
        const valueTypes = req.query.types.split(",");
        const values = await valueTypes.reduce(async (grouping, type) => {
            const currentGrouping = await grouping;
            const currentType = await type;
            currentGrouping[currentType] = await repositoryMapping[currentType].fetchAll();
            return currentGrouping;
        }, {});
        res.json(values);
    } catch (error) {
        console.error(error);
        res.status(500)
            .json({
                "message": `Error in getting values`
            });
    }
});

router.get("/:type",
    checkValueType,
    async (req, res) => {
        try {
            const type = req.params.type;
            const repository = repositoryMapping[type];
            console.info(`Getting all '${type}'`);
            const results = await repository.fetchAll();
            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": `Error in getting '${type}' values`
                });
        }
    }
);

router.post("/:type",
    checkValueType,
    async (req, res) => {
        try {
            const type = req.params.type;
            const body = req.body;
            console.info("New value: ", body);
            const repository = repositoryMapping[type];

            let insertId;
            if (type === "sales_rep") {
                // TODO: separate handling
            } else {
                insertId = await repository.insert(body.name);
            }

            res.status(201).json({
                id: insertId,
                name: body.name
            });
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": `Error in adding new item for type '${type}'`
                });
        }
    }
);

router.delete("/:type/:id",
    checkValueType,
    async (req, res) => {
        try {
            const type = req.params.type;
            const id = req.params.id;
            const repository = repositoryMapping[type];
            console.info(`Deleting #${id} from '${type}'`);
            const result = await repository.deleteById(id);
            res.json({
                id,
                deleted: true
            });
        } catch (error) {
            console.error(error);
            res.status(500)
                .json({
                    "message": `Error in deleting #${id} from '${type}'`
                });
        }
    }
);

const repositoryMapping = {
    "sales_rep": salesRepRepository,
    "deal": nameValuesRepository("deal_types"),
    "output_consistency": nameValuesRepository("output_consistency"),
    "crc": nameValuesRepository("crc"),
}

module.exports = router;
