const db = require("../db");

async function insert(client) {
    try {
        const pool = await db.init();
        const stmt = `
            INSERT INTO clients (
                email,
                sales_rep_id,
                licensed_business_name,
                doing_business_as,
                completed_w9,
                license_num,
                license_file_1,
                license_num_2,
                license_file_2,
                license_num_3,
                license_file_3,
                cdtfa_seller_permit_file,
                cdtfa_seller_permit_num,
                license_types,
                license_expiration,
                license_address,
                license_address_city,
                license_address_state,
                license_address_zip,
                main_contact_name,
                main_contact_title,
                main_contact_phone,
                delivery_pickup_contact_name,
                delivery_pickup_contact_phone,
                delivery_pickup_contact_email,
                delivery_pickup_constraints,
                metrc_contact_phone,
                metrc_contact_email,
                accounting_full_name,
                accounting_phone,
                accounting_email,
                accounting_instructions,
                products_interested
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const { insertId } = await pool.query(stmt, [
            client.email,
            client.sales_rep_id,
            client.licensed_business_name,
            client.doing_business_as,
            client.completed_w9,
            client.license_num,
            client.license_file_1,
            client.license_num_2,
            client.license_file_2,
            client.license_num_3,
            client.license_file_3,
            client.cdtfa_seller_permit_file,
            client.cdtfa_seller_permit_num,
            client.license_types,
            client.license_expiration,
            client.license_address,
            client.license_address_city,
            client.license_address_state,
            client.license_address_zip,
            client.main_contact_name,
            client.main_contact_title,
            client.main_contact_phone,
            client.delivery_pickup_contact_name,
            client.delivery_pickup_contact_phone,
            client.delivery_pickup_contact_email,
            client.delivery_pickup_constraints,
            client.metrc_contact_phone,
            client.metrc_contact_email,
            client.accounting_full_name,
            client.accounting_phone,
            client.accounting_email,
            client.accounting_instructions,
            client.products_interested
        ]);
        console.info(`[ClientRepository] New record inserted #${insertId}`);
        client.id = insertId;
        return client;
    } catch (error) {
        console.error("[ClientRepository] Error in inserting new client");
        throw error;
    }
}

// partial update
async function update(id, clientUpdates) {
    try {
        const pool = await db.init();
        // TODO: Use group by implementation
        let updateValues = [];
        const fieldUpdates = Object.entries(clientUpdates)  // column = new_value (comma-delimited)
            .map(([column, newValue]) => {
                updateValues.push(newValue);
                return `${column} = ?`;
            })
            .join(",");
        console.info(`Field to update: ${fieldUpdates}`);
        const stmt = `
            UPDATE clients
            SET ${fieldUpdates}
            WHERE id = ${id}
        `;
        console.info(`Update statement:\n ${stmt}`);
        const result = await pool.query(stmt, updateValues);
        console.info(`Client ${id} update result: `, result);
        return {
            id,
            updated: result.changedRows === 1
        };
    } catch (error) {
        console.error("[ClientRepository] Error in updating client");
        throw error;
    }
}

async function fetchAll() {
    try {
        const pool = await db.init();
        const stmt = `SELECT * FROM clients`;
        const results = await pool.query(stmt);
        console.info(`[ClientRepository] Number of results: ${results.length}`);
        return results;
    } catch (error) {
        console.error("[ClientRepository] Error in fetching clients");
        throw error;
    }
}

module.exports = {
    insert,
    update,
    fetchAll
}
