const express = require("express");
const router = express.Router();

const intakeRepository = require("../intake/repository");
const workOrderService = require("../work-order/service");
const workOrderRepository = require("../work-order/repository");
const { validateFirebaseIdToken, validateRole } = require("../auth/middleware");
const { saveAuditLog } = require("../audit/middleware");
const { padID } = require("../util");

router.use(validateFirebaseIdToken);
router.use(validateRole("Employee"));

router.post("/work-order/:id",
    async (req, res, next) => {
        const id = req.params.id;
        let workOrderStatus;
        try {
            const workOrder = await workOrderRepository.fetchById(id);
            const intake = await intakeRepository.fetchById(workOrder.intake_id);
            const workOrderItem = intake.items.find(item => item.id === workOrder.item_id);
            let ingredients;
            if (workOrderItem.item_type === "Mix") {
                ingredients = intake.items.filter(item => item.id !== workOrderItem.id
                    && item.final_sku_or_mix === workOrderItem.final_sku_or_mix);
            }
            const { template_id } = await workOrderService.generateWorkOrder(workOrder, ingredients);
            const { updated } = await workOrderRepository.update({
                id,
                template_id,
                status: "Done"
            });
            let status = "Pending";
            if (updated)
                status = "Done";
            workOrderStatus = {
                id,
                template_id,
                status
            }
            res.json(workOrderStatus);
        } catch (error) {
            console.error(error);
            try {
                workOrderStatus = {
                    id,
                    status: "Failed"
                }
                await workOrderRepository.update(workOrderStatus);
            } catch (updateError) {
                console.error("Error in updating work order status: ", updateError);
            } finally {
                res.status(500)
                    .json({
                        "id": id,
                        "message": "Error in generating work order"
                    });
            }
        }
        res.locals.workOrderStatus = workOrderStatus;
        next();
    },
    saveAuditLog((req, res) => {
        const { id, status, template_id } = res.locals.workOrderStatus;
        let action;
        if (status === "Done") {
            action = `Generated Work Order #${padID(id)}. Document ID is ${template_id}`;
        } else {
            action = `Attempted to generate Work Order #${padID(id)} but failed`;
        }
        return action;
    })
);

router.get("/work-order", async (req, res) => {
    try {
        const workOrders = await workOrderRepository.fetchAll();
        console.info(`Number of work orders: ${workOrders.length}`);
        res.json(workOrders);
    } catch (error) {
        console.error(error);
        res.status(500)
            .json({
                "message": "Error in getting work orders"
            });
    }
});

module.exports = router;
