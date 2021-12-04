const groupBy = require("lodash/groupBy");
const db = require("../db");

async function insert(intake) {
    try {
        const pool = await db.init();
        const insertIntakeStmt = `
            INSERT INTO intakes (
                client_id,
                origin_client_id,
                sales_rep_id,
                origin_dba,
                origin_license_name,
                origin_license_num,
                type,
                delivery_date,
                pickup_date,
                fresh_total_qty_grams,
                fresh_total_qty_lbs,
                leaf_total_qty_grams,
                leaf_total_qty_lbs,
                deal,
                intake_notes,
                dispatcher_notes,
                bookkeeper_notes,
                intake_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const intakeId = await db.beginTx(pool)(async (conn) => {
            // insert intake
            console.info("Insert statement:\n", insertIntakeStmt);
            const { insertId: intakeId } = await conn.query(insertIntakeStmt, [
                intake.client_id,
                intake.origin_client_id,
                intake.sales_rep_id,
                intake.origin_dba,
                intake.origin_license_name,
                intake.origin_license_num,
                intake.type,
                intake.delivery_date,
                intake.pickup_date,
                intake.fresh_total_qty_grams,
                intake.fresh_total_qty_lbs,
                intake.leaf_total_qty_grams,
                intake.leaf_total_qty_lbs,
                intake.deal,
                intake.intake_notes,
                intake.dispatcher_notes,
                intake.bookkeeper_notes,
                intake.intake_status
             ]);
            console.info(`New intake inserted #${intakeId}`);

            // insert items
            await insertIntakeItems(conn)(intakeId, intake.items);

            return intakeId;
        });

        return await fetchById(intakeId);
    } catch (error) {
        console.error("[Intake Repository] Error saving new intake");
        throw error;
    }
}

async function fetchById(id) {
    try {
        const pool = await db.init();
        const stmt = selectIntakesStmt + `
            WHERE id.id = ?
        `;
        const results = await pool.query(stmt, [id]);
        console.info(`Number of results: ${results.length}`);
        console.info(`Fetch record with ID: ${id}\n`, results);
        return results.length > 0 ? mapRowsToIntake(results) : null;
    } catch (error) {
        console.error(`[Intake Repository] Error fetching intake #${id}`);
        throw error;
    }
}

async function fetchAll() {
    try {
        const pool = await db.init();
        const results = await pool.query(selectIntakesStmt);
        console.info(`Number of results: ${results.length}`);
        const intakeGrouping = groupBy(results, "id");
        console.info(intakeGrouping);
        return Object.values(intakeGrouping).map(mapRowsToIntake);
    } catch (error) {
        console.error("[Intake Repository] Error in fetching all intakes");
        throw error;
    } 
}

async function fetch(criteria) {
    try {
        const pool = await db.init();
        const conditions = Object.entries(criteria).map(([column, condition]) =>
            `${column} = '${condition}'`
        );
        const stmt = selectIntakesStmt + `
            WHERE ${conditions}
        `;
        console.info("Query:\n" + stmt);
        const results = await pool.query(stmt);
        console.info(`Number of results: ${results.length}`);
        const intakeGrouping = groupBy(results, "id");
        return Object.values(intakeGrouping).map(mapRowsToIntake);
    } catch (error) {
        console.error("[Intake Repository] Error in fetching intakes");
        throw error;
    }
}

async function fetchIntakesForPickup(status) {
    try {
        const pool = await db.init();
        const results = await pool.query(selectIntakesForPickupStmt(status));
        console.info(`Number of results: ${results.length}`);
        return results;
    } catch (error) {
        console.error("[Intake Repository] Error fetching intakes for pickup");
        throw error;
    }
}

async function fetchIntakesForManager() {
    try {
        const pool = await db.init();
        const stmt = selectIntakesStmt + `
            WHERE intake_status IN ('Intake-Manager', 'Intake-Manager-Draft')
        `;
        console.info("Query:\n" + stmt);
        const results = await pool.query(stmt);
        console.info(`Number of results: ${results.length}`);
        const intakeGrouping = groupBy(results, "id");
        return Object.values(intakeGrouping).map(mapRowsToIntake);
    } catch (error) {
        console.error("[Intake Repository] Error fetching intakes for pickup");
        throw error;
    }
}

async function update(intake) {
    try {
        const pool = await db.init();
        return await db.beginTx(pool)(async (conn) => {
            // update intake
            const stmt = `
                UPDATE intakes
                SET manifest_num = ?,
                    intake_status = ?
                WHERE id = ?
            `;
            const { id, intake_status } = intake;
            const manifest_num = intake.manifest_num.join(",");
            const { changedRows } = await conn.query(stmt, [manifest_num, intake_status, id]);
            const intakeUpdated = changedRows > 0;
            console.info("Intake updated: ", intakeUpdated);

            const { items, items_to_delete } = intake;
            let updatedItems = 0;
            let insertedItems = 0;
            let deletedItems = 0;
            if (items && items.length > 0) {
                // update intake items
                const itemsToUpdate = items.filter(({ id }) => !!id);
                updatedItems = await updateIntakeItems(conn)(itemsToUpdate);

                // insert intake items
                const newItems = items.filter(({ id }) => !id);
                console.info(`Number of new items: ${newItems.length}`);
                if (newItems.length > 0)
                    insertedItems = await insertIntakeItems(conn)(id, newItems);
            }

            if (items_to_delete && items_to_delete.length > 0) {
                // delete intake items
                deletedItems = await deleteIntakeItems(conn)(items_to_delete);
            }

            return {
                intakeUpdated,
                updatedItems,
                insertedItems,
                deletedItems
            }
        });
    } catch (error) {
        console.error("[Intake Repository] Error in updating intake");
        throw error;
    }
}

async function updateMany(updates) {
    try {
        const pool = await db.init();

        function toUpdateStmt(update) {
            const { fieldUpdates, updateValues } = Object.entries(update).reduce((grouping, [column, value]) => {
                if (column !== "id") {
                    grouping.fieldUpdates.push(`${column} = ?`);
                    grouping.updateValues.push(value);
                }
                return grouping;
            },
            {
                fieldUpdates: [],
                updateValues: []
            });

            return {
                stmt:
                `
                UPDATE intakes
                SET ${fieldUpdates}
                WHERE id = ?
                `,
                updateValues: [...updateValues, update.id]
            }
        }
        return await db.beginTx(pool)(async (conn) => {
            await updates.map(toUpdateStmt)
                .forEach(async ({ stmt, updateValues }) => await conn.query(stmt, updateValues));
            return {
                updated: true
            }
        });
    } catch (error) {
        console.error(`[Intake Repository] Error batch update`);
        throw error;
    }
}

function insertIntakeItems(conn) {
    return async (intakeId, items) => {
        const insertItemStmt = `
            INSERT INTO intake_items (
                intake_id,
                item_name,
                qty_grams,
                qty_lbs,
                fresh_or_leaf,
                processing_type,
                output_consistency,
                output_name,
                special_directions,
                crc,
                metrc_uid,
                metrc_qty_grams,
                received_qty_grams,
                metrc_received_discrepancy_grams,
                metrc_received_discrepancy_perc,
                item_type,
                final_sku_or_mix,
                lot_num
            ) VALUES ?
        `;

        const itemsToInsert = items.map(item => [
            intakeId,
            item.item_name,
            item.qty_grams,
            item.qty_lbs,
            item.fresh_or_leaf,
            item.processing_type,
            item.output_consistency,
            item.output_name,
            item.special_directions,
            item.crc,
            item.metrc_uid,
            item.metrc_qty_grams,
            item.received_qty_grams,
            item.metrc_received_discrepancy_grams,
            item.metrc_received_discrepancy_perc,
            item.item_type,
            item.final_sku_or_mix,
            item.lot_num
        ]);

        console.info("Intake items to insert:\n", itemsToInsert);
        const { affectedRows } = await conn.query(insertItemStmt, [itemsToInsert]);
        console.info(`Number of items inserted:`, affectedRows);

        return affectedRows;
    }
}

function updateIntakeItems(conn) {
    return async (items) => {
        const updateItemStmt = `
            UPDATE intake_items
            SET metrc_uid = ?,
                metrc_qty_grams = ?,
                received_qty_grams = ?,
                metrc_received_discrepancy_grams = ?,
                metrc_received_discrepancy_perc = ?,
                item_type = ?,
                final_sku_or_mix = ?,
                lot_num = ?
            WHERE id = ?
        `;

        const updateQueries = items.map(item => {
            const updateValues = [
                item.metrc_uid,
                item.metrc_qty_grams,
                item.received_qty_grams,
                item.metrc_received_discrepancy_grams,
                item.metrc_received_discrepancy_perc,
                item.item_type,
                item.final_sku_or_mix,
                item.lot_num,
                item.id
            ];
            console.info("Update item values: ", updateValues);

            return conn.query(updateItemStmt, updateValues);
        });

        return (await Promise.all(updateQueries))
            .reduce((totalUpdated, { changedRows }) => totalUpdated + changedRows, 0);
    }
}

function deleteIntakeItems(conn) {
    return async (items) => {
        const deleteItemStmt = `
            DELETE FROM intake_items
            WHERE id IN (?)
        `;
        const idsToDelete = items.map(item => item.id);
        const { affectedRows } = await conn.query(deleteItemStmt, [idsToDelete]);
        return affectedRows;
    }
}

function mapRowsToIntake(rows) {
    return rows.reduce((intake, row) => {
        intake.id = row.id;
        intake.client_name = row.client_name;
        intake.origin_client_id = row.origin_client_id;
        intake.origin_dba = row.origin_dba;
        intake.origin_license_name = row.origin_license_name;
        intake.origin_license_num = row.origin_license_num;
        intake.sales_rep = row.sales_rep;
        intake.type = row.type;
        intake.delivery_date = row.delivery_date;
        intake.pickup_date = row.pickup_date;
        intake.scheduled_pickup_date = row.scheduled_pickup_date;
        intake.actual_pickup_date = row.actual_pickup_date;
        intake.fresh_total_qty_grams = row.fresh_total_qty_grams;
        intake.fresh_total_qty_lbs = row.fresh_total_qty_lbs;
        intake.leaf_total_qty_grams = row.leaf_total_qty_grams;
        intake.leaf_total_qty_lbs = row.leaf_total_qty_lbs;
        intake.deal = row.deal;
        intake.intake_notes = row.intake_notes;
        intake.dispatcher_notes = row.dispatcher_notes;
        intake.bookkeeper_notes = row.bookkeeper_notes;
        intake.manifest_num = row.manifest_num ? row.manifest_num.split(",") : [];
        intake.invoice_or_bill = row.invoice_or_bill;
        intake.intake_status = row.intake_status;
        intake.date_created = row.intake_date_created;
        intake.date_updated = row.intake_date_updated;

        intake.items.push({
            id: row.item_id,
            item_name: row.item_name,
            metrc_uid: row.metrc_uid,
            qty_grams: row.qty_grams,
            qty_lbs: row.qty_lbs,
            received_qty_grams: row.received_qty_grams,
            metrc_qty_grams: row.metrc_qty_grams,
            metrc_received_discrepancy_grams: row.metrc_received_discrepancy_grams,
            metrc_received_discrepancy_perc: row.metrc_received_discrepancy_perc,
            fresh_or_leaf: row.fresh_or_leaf,
            processing_type: row.processing_type,
            output_consistency: row.output_consistency,
            output_name: row.output_name,
            item_type: row.item_type,
            final_sku_or_mix: row.final_sku_or_mix,
            lot_num: row.lot_num,
            special_directions: row.special_directions,
            crc: row.crc,
            toll_processing_rate: row.toll_processing_rate,
            received_qty_toll_proc_rate: row.received_qty_toll_proc_rate,
            bill_amount: row.bill_amount,
            bill_num: row.bill_num,
            date_created: row.item_date_created,
            date_updated: row.item_date_updated
        });

        return intake;
    }, { items: [] })
}

const selectIntakesStmt = `
SELECT 
    id.id,
    (SELECT doing_business_as FROM clients WHERE id = id.client_id) as client_name,
    id.origin_client_id,
    id.origin_dba,
    id.origin_license_name,
    id.origin_license_num,
    (SELECT first_name FROM sales_reps WHERE id = id.sales_rep_id) as sales_rep,
    id.type,
    id.delivery_date,
    id.pickup_date,
    id.scheduled_pickup_date,
    id.actual_pickup_date,
    id.fresh_total_qty_grams,
    id.fresh_total_qty_lbs,
    id.leaf_total_qty_grams,
    id.leaf_total_qty_lbs,
    id.deal,
    id.manifest_num,
    id.intake_notes,
    id.dispatcher_notes,
    id.bookkeeper_notes,
    id.intake_status,
    id.invoice_or_bill,
    id.date_created as intake_date_created,
    id.date_updated as intake_date_updated,
    ii.id as item_id,
    ii.item_name,
    ii.metrc_uid,
    ii.qty_grams,
    ii.qty_lbs,
    ii.received_qty_grams,
    ii.metrc_qty_grams,
    ii.metrc_received_discrepancy_grams,
    ii.metrc_received_discrepancy_perc,
    ii.fresh_or_leaf,
    ii.processing_type,
    ii.output_consistency,
    ii.output_name,
    ii.item_type,
    ii.final_sku_or_mix,
    ii.lot_num,
    ii.special_directions,
    ii.crc,
    ii.toll_processing_rate,
    ii.received_qty_toll_proc_rate,
    ii.invoice_num,
    ii.bill_amount,
    ii.bill_num,
    ii.date_created as item_date_created,
    ii.date_updated as item_date_updated
FROM intakes id
INNER JOIN sales_reps sr ON sr.id = id.sales_rep_id
INNER JOIN intake_items ii on ii.intake_id = id.id
`;

const selectIntakesForPickupStmt = (status) => `
SELECT
    i.id,
    (SELECT doing_business_as FROM clients WHERE id = i.client_id) as client_name,
    i.pickup_date,
    i.scheduled_pickup_date,
    i.fresh_total_qty_grams,
    i.fresh_total_qty_lbs,
    i.leaf_total_qty_grams,
    i.leaf_total_qty_lbs,
    i.dispatcher_notes,
    i.date_created,
    c.id as client_id,
    c.doing_business_as,
    c.license_num,
    c.license_address,
    c.license_address_city,
    c.license_address_state,
    c.license_address_zip,
    c.delivery_pickup_contact_name,
    c.delivery_pickup_contact_phone,
    c.delivery_pickup_contact_email,
    c.delivery_pickup_constraints,
    c.dispatch_driver_notes
FROM intakes i
INNER JOIN clients c ON c.id = i.origin_client_id
WHERE i.intake_status = '${status}'
`;

module.exports = {
    insert,
    fetchById,
    fetchAll,
    fetchIntakesForPickup,
    fetchIntakesForManager,
    fetch,
    update,
    updateMany
}
