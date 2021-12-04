exports.up = function(knex) {
    return knex.schema
        .createTable("sales_reps", table => {
            table.increments("id").primary();
            table.string("first_name", 100).notNullable();
            table.string("last_name", 100).notNullable();
            table.string("email", 50).notNullable();
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable("deal_types", table => {
            table.increments("id").primary();
            table.string("name", 50).notNullable();
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable("output_consistency", table => {
            table.increments("id").primary();
            table.string("name", 50).notNullable();
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable("crc", table => {
            table.increments("id").primary();
            table.string("name", 50).notNullable();
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable("clients", table => {
            table.increments("id").primary();
            table.string("email", 50);
            table.integer("sales_rep_id").unsigned().notNullable();
            table.string("licensed_business_name", 150);
            table.string("doing_business_as", 150);
            table.string("license_address", 150);
            table.string("license_address_city", 100);
            table.string("license_address_state", 100);
            table.string("license_address_zip", 10);
            table.string("main_contact_name", 150);
            table.string("main_contact_title", 25);
            table.string("main_contact_phone", 50);
            table.string("delivery_pickup_constraints");
            table.string("delivery_pickup_contact_name", 150);
            table.string("delivery_pickup_contact_phone", 50);
            table.string("delivery_pickup_contact_email", 50);
            table.string("retail_locations");
            table.string("dispatch_driver_notes");
            table.string("client_notes");
            table.string("fulfillment_notes");
            table.string("accounting_full_name", 150);
            table.string("accounting_phone", 50);
            table.string("accounting_email", 50);
            table.string("accounting_instructions");
            table.string("payment_terms", 25);
            table.string("payment_type", 25);
            table.string("products_interested");
            table.string("license_types", 100);
            table.string("license_num", 50);
            table.string("license_file_1");
            table.string("license_num_2", 50);
            table.string("license_file_2");
            table.string("license_num_3", 50);
            table.string("license_file_3");
            table.date("license_expiration");
            table.string("cdtfa_seller_permit_file");
            table.string("cdtfa_seller_permit_num", 50);
            table.string("completed_w9");
            table.string("metrc_contact_phone", 50);
            table.string("metrc_contact_email", 50);
            table.decimal("leaf_solventless_toll_proc_rate", 10, 2);
            table.decimal("fresh_solventless_toll_proc_rate", 10, 2);
            table.decimal("leaf_bho_toll_proc_rate", 10, 2);
            table.decimal("fresh_bho_toll_proc_rate", 10, 2);
            table.decimal("split_processing", 5, 2);
            table.decimal("bear_labs_collab", 5, 2);
            table.decimal("leaf_purchase_price_per_perc", 5, 2);
            table.decimal("leaf_purchase_price_per_kg", 5, 2);
            table.decimal("fresh_purchase_price_per_perc", 5, 2);
            table.decimal("fresh_purchase_price_per_kg", 5, 2);
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
            table.foreign("sales_rep_id").references("id").inTable("sales_reps");
        })
        .createTable("intakes", table => {
            table.increments("id").primary();
            table.integer("client_id").unsigned().notNullable();
            table.integer("origin_client_id").unsigned().notNullable();
            table.integer("sales_rep_id").unsigned().notNullable();
            table.string("origin_dba").notNullable();
            table.string("origin_license_name");
            table.string("origin_license_num", 50);
            table.string("type", 10);
            table.date("delivery_date");
            table.date("pickup_date");
            table.date("scheduled_pickup_date");
            table.date("actual_pickup_date");
            table.decimal("fresh_total_qty_grams", 10, 2);
            table.decimal("fresh_total_qty_lbs", 10, 2);
            table.decimal("leaf_total_qty_grams", 10, 2);
            table.decimal("leaf_total_qty_lbs", 10, 2);
            table.string("deal", 25);
            table.string("manifest_num", 150);
            table.string("intake_notes");
            table.string("dispatcher_notes");
            table.string("bookkeeper_notes");
            table.string("invoice_or_bill", 25);
            table.string("intake_status", 25);
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
            table.foreign("client_id").references("id").inTable("clients");
            table.foreign("origin_client_id").references("id").inTable("clients");
            table.foreign("sales_rep_id").references("id").inTable("sales_reps");

        })
        .createTable("intake_items", table => {
            table.increments("id").primary();
            table.string("item_name", 50).notNullable();
            table.string("metrc_uid", 25);
            table.decimal("qty_grams", 10, 2);
            table.decimal("qty_lbs", 10, 2);
            table.decimal("received_qty_grams", 10, 2);
            table.decimal("metrc_qty_grams", 10, 2);
            table.decimal("metrc_received_discrepancy_grams", 10, 2);
            table.decimal("metrc_received_discrepancy_perc", 10, 2);
            table.string("fresh_or_leaf", 25);
            table.string("processing_type", 50);
            table.string("output_consistency", 50);
            table.string("output_name", 150);
            table.string("item_type", 50);
            table.string("final_sku_or_mix", 50);
            table.string("lot_num", 50);
            table.string("special_directions");
            table.string("crc", 50);
            table.decimal("toll_processing_rate", 10, 2);
            table.decimal("received_qty_toll_proc_rate", 10, 2);
            table.string("invoice_num", 150);
            table.decimal("bill_amount", 10, 2);
            table.string("bill_num", 150);
            table.boolean("pack_priority").defaultTo(false);
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
            table.integer("intake_id").unsigned().references("id").inTable("intakes");
        })
        .createTable("work_orders", table => {
            table.increments("id").primary();
            table.string("template_id", 50);
            table.string("status", 25).defaultTo("Pending").notNullable();
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
            table.integer("item_id").unsigned().references("id").inTable("intake_items").notNullable();
        })
        .createTable("audit_logs", table => {
            table.increments("id").primary();
            table.string("name", 50);
            table.string("email", 50);
            table.string("action").notNullable();
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable("bho_packs", table => {
            table.increments("id").primary();
            table.integer("client_id").unsigned().notNullable();
            table.string("strain_name", 100).notNullable();
            table.string("metrc_uid", 25).notNullable();
            table.string("lot_num", 50).notNullable();
            table.decimal("total_weight_grams", 10, 2).notNullable();
            table.decimal("tube_weight_grams", 10, 2).notNullable();
            table.string("material_type", 25).notNullable();    // Fresh / Leaf
            table.string("output_consistency", 50);
            table.string("original_metrc_uid", 50);
            table.string("ancestor_metrc_uids");
            table.integer("work_order_id").unsigned().notNullable();
            table.datetime("pack_date").notNullable();
            table.string("packed_by").notNullable();
            table.string("supervising_processor").notNullable();
            table.integer("material_quality").notNullable();
            table.integer("material_smell").notNullable();
            table.string("stored_location", 25);
            table.timestamp("date_created").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
            table.timestamp("date_updated").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
            table.foreign("client_id").references("id").inTable("clients");
            table.foreign("work_order_id").references("id").inTable("work_orders");
        })
};

exports.down = function(knex) {
    knex.schema
        .dropTableIfExists("bho_packs")
        .dropTableIfExists("audit_logs")
        .dropTableIfExists("work_orders")
        .dropTableIfExists("intake_items")
        .dropTableIfExists("intakes")
        .dropTableIfExists("clients")
        .dropTableIfExists("deal_types")
        .dropTableIfExists("sales_reps")
        .dropTableIfExists("output_consistency")
        .dropTableIfExists("crc");
};
