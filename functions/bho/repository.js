const db = require("../db");

async function fetchItemsToPack() {
    try {
        const pool = await db.init();
        const stmt = `
            SELECT
                ii.id,
                (SELECT doing_business_as FROM clients WHERE id = i.client_id) as client_name,
                ii.item_name AS strain_name,
                ii.metrc_uid,
                ii.qty_grams,
                ii.lot_num,
                ii.output_consistency,
                ii.fresh_or_leaf,
                ii.processing_type,
                ii.pack_priority,
                ii.date_created,
                wo.id AS work_order_id,
                wo.template_id
            FROM intake_items ii
            INNER JOIN intakes i ON i.id = ii.intake_id
            INNER JOIN work_orders wo ON wo.item_id = ii.id
            WHERE ii.processing_type = 'BHO'
            AND i.intake_status = 'Processing'
            ORDER BY ii.pack_priority DESC, ii.date_created
        `;
        const results = await pool.query(stmt);
        console.info(`[BhoRepository] Number of results: ${results.length}`);
        return results;
    } catch (error) {
        console.error("[BhoRepository] Error in fetching intake items for BHO packaging");
        throw error;
    }
}

async function fetchItemById(id) {
    try {
        const pool = await db.init();
        const stmt = `
            SELECT
                ii.id,
                (SELECT doing_business_as FROM clients WHERE id = i.client_id) AS client_name,
                ii.item_name AS strain_name,
                ii.metrc_uid,
                ii.qty_grams,
                ii.lot_num,
                ii.output_consistency,
                ii.fresh_or_leaf,
                ii.processing_type,
                ii.pack_priority,
                ii.date_created,
                wo.id AS work_order_id,
                wo.template_id
            FROM intake_items ii
            INNER JOIN intakes i ON i.id = ii.intake_id
            INNER JOIN work_orders wo ON wo.item_id = ii.id
            WHERE ii.id = ?
        `;
        const results = await pool.query(stmt, [id]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error(`[BhoRepository] Error in fetching intake item #${id}`);
        throw error;
    }
}

async function insert(package, intakeItem) {
    try {
        const pool = await db.init();
        const insertStmt = `
            INSERT INTO bho_packs (
                client_id,
                strain_name,
                metrc_uid,
                lot_num,
                total_weight_grams,
                tube_weight_grams,
                material_type,
                output_consistency,
                original_metrc_uid,
                ancestor_metrc_uids,
                work_order_id,
                pack_date,
                packed_by,
                supervising_processor,
                material_quality,
                material_smell,
                stored_location
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const updateItemStmt = `
            UPDATE intake_items
            SET qty_grams = ?,
                qty_lbs = ?
            where id = ?
        `;

        const bhoPackId = await db.beginTx(pool)(async (conn) => {
            // update intake item
            await conn.query(updateItemStmt, [
                intakeItem.qty_grams,
                intakeItem.qty_lbs,
                intakeItem.id
            ]);

            const { insertId } = await pool.query(insertStmt, [
                package.client_id,
                package.strain_name,
                package.metrc_uid,
                package.lot_num,
                package.total_weight_grams,
                package.tube_weight_grams,
                package.material_type,
                package.output_consistency,
                package.original_metrc_uid,
                package.ancestor_metrc_uids,
                package.work_order_id,
                package.pack_date,
                package.packed_by,
                package.supervising_processor,
                package.material_quality,
                package.material_smell,
                package.stored_location
            ]);

            return insertId;
        });

        item.id = bhoPackId;
        return item;
    } catch (error) {
        console.error("[BhoRepository] Error in saving new BHO pack");
        throw error;
    }
}



module.exports = {
    fetchItemsToPack,
    fetchItemById,
    insert
}
