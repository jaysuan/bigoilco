const db = require("../db");

async function insertMany(workOrders) {
    try {
        const pool = await db.init();
        const stmt = `
            INSERT INTO work_orders (item_id) VALUES ?
        `
        const itemIds = workOrders.map(workOrder => [workOrder.item_id]);
        const { affectedRows } = await pool.query(stmt, [itemIds]);
        return affectedRows;
    } catch (error) {
        console.error("[Work Order Repository] Error in saving work orders");
        throw error;
    }
}

async function fetchAll() {
    try {
        const pool = await db.init();
        return await pool.query(selectWorkOrdersStmt);
    } catch (error) {
        console.error("[Work Order Repository] Error in fetching work orders");
        throw error;
    }
}

async function fetchById(id) {
    try {
        const pool = await db.init();
        const stmt = selectWorkOrderDetails + `
            WHERE wo.id = ?
        `
        const results = await pool.query(stmt, [id]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error(`[Work Order Repository] Error in fetching work order ${id}`);
        throw error;
    }
}

async function update(workOrder) {
    try {
        const pool = await db.init();
        const { id, status, template_id } = workOrder;
        const stmt = `
            UPDATE work_orders
            SET status = ?,
                template_id = ?
            WHERE id = ?
        `
        const { changedRows } = await pool.query(stmt, [ status, template_id, id ]);
        return {
            updated: changedRows > 0
        }
    } catch (error) {
        console.error(`[Work Order Repository] Error in updating work order`);
        throw error;
    }
}

const selectWorkOrdersStmt = `
SELECT
    wo.id,
    wo.item_id,
    ii.item_type,
    wo.template_id,
    wo.status,
    wo.date_created
FROM work_orders wo
INNER JOIN intake_items ii
    ON wo.item_id = ii.id
`

const selectWorkOrderDetails = `
SELECT
    wo.id as work_order_id,
    wo.template_id,
    wo.status,
    wo.date_created,
    (SELECT doing_business_as FROM clients WHERE id = i.client_id) as client_name,
    (SELECT first_name FROM sales_reps WHERE id = i.sales_rep_id) as sales_rep,
    i.id as intake_id,
    i.manifest_num,
    ii.id as item_id,
    ii.metrc_uid,
    ii.item_name,
    ii.output_consistency,
    ii.processing_type,
    ii.item_type,
    ii.final_sku_or_mix,
    ii.lot_num,
    ii.qty_grams
FROM work_orders wo
INNER JOIN intake_items ii
    ON wo.item_id = ii.id
INNER JOIN intakes i
    ON ii.intake_id = i.id
`

module.exports = {
    insertMany,
    fetchAll,
    fetchById,
    update
}
