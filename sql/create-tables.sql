CREATE TABLE sales_reps (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE deal_types (
    id INT AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE output_consistency (
    id INT AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE crc (
    id INT AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE clients (
    id INT AUTO_INCREMENT,
    licensed_business_name VARCHAR(150),
    doing_business_as VARCHAR(150),
    license_address VARCHAR(150),
    license_address_city VARCHAR(50),
    license_address_state VARCHAR(50),
    license_address_zip VARCHAR(10),
    main_contact_name VARCHAR(100),
    main_contact_title VARCHAR(25),
    main_contact_phone VARCHAR(50),
    email VARCHAR(50),
    delivery_pickup_constraints VARCHAR(255),
    delivery_pickup_contact_name VARCHAR(100),
    delivery_pickup_contact_phone VARCHAR(50),
    delivery_pickup_contact_email VARCHAR(50),
    retail_locations VARCHAR(255),
    dispatch_driver_notes VARCHAR(150),
    client_notes VARCHAR(255),
    fulfillment_notes VARCHAR(255),
    accounting_full_name VARCHAR(100),
    accounting_phone VARCHAR(50),
    accounting_email VARCHAR(50),
    accounting_instructions VARCHAR(255),
    payment_terms VARCHAR(25),
    payment_type VARCHAR(25),
    products_interested VARCHAR(150),
    license_type VARCHAR(50),
    license_num VARCHAR(50),
    license_expiration DATE,
    license_file_1 VARCHAR(255),
    license_file_2 VARCHAR(255),
    license_file_3 VARCHAR(255),
    cdtfa_seller_permit_file VARCHAR(255),
    cdtfa_seller_permit_num VARCHAR(50),
    completed_w9 VARCHAR(255),
    metrc_contact_phone VARCHAR(50),
    metrc_contact_email VARCHAR(50),
    leaf_solventless_toll_proc_rate DECIMAL(10,2),
    fresh_solventless_toll_proc_rate DECIMAL(10,2),
    leaf_bho_toll_proc_rate DECIMAL(10,2),
    fresh_bho_toll_proc_rate DECIMAL(10,2),
    split_processing FLOAT,
    bear_labs_collab FLOAT,
    leaf_purchase_price_per_perc DECIMAL(10,2),
    leaf_purchase_price_per_kg DECIMAL(10,2),
    fresh_purchase_price_per_perc DECIMAL(10,2),
    fresh_purchase_price_per_kg DECIMAL(10,2),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE intakes (
    id INT AUTO_INCREMENT,
    client_id INT NOT NULL,
    sales_rep_id INT NOT NULL,
    origin_dba VARCHAR(255) NOT NULL,
    origin_license_name VARCHAR(255),
    origin_license_num VARCHAR(50),
    type VARCHAR(10),
    delivery_date DATETIME,
    pickup_date DATETIME,
    scheduled_pickup_date DATETIME,
    actual_pickup_date DATETIME,
    fresh_total_qty_grams DECIMAL(10,2),
    fresh_total_qty_lbs DECIMAL(10,2),
    leaf_total_qty_grams DECIMAL(10,2),
    leaf_total_qty_lbs DECIMAL(10,2),
    deal VARCHAR(25),
    intake_status VARCHAR(25),
    invoice_or_bill VARCHAR(25),
    manifest_num VARCHAR(150),
    bill_amount DECIMAL(10,2),
    bill_num VARCHAR(150),
    intake_notes VARCHAR(255),
    dispatcher_notes VARCHAR(255),
    bookkeeper_notes VARCHAR(255),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (client_id) REFERENCES clients (id),
    FOREIGN KEY (sales_rep_id) REFERENCES sales_reps (id)
);

CREATE TABLE intake_items (
    id INT AUTO_INCREMENT,
    intake_id INT NOT NULL,
    item_num INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    metrc_uid VARCHAR(50),
    qty_grams DECIMAL(10, 2),
    qty_lbs DECIMAL(10, 2),
    received_qty_grams DECIMAL(10, 2),
    metrc_qty_grams DECIMAL(10, 2),
    metrc_received_discrepancy_grams DECIMAL(10, 2),
    metrc_received_discrepancy_perc DECIMAL(10, 2),
    fresh_or_leaf VARCHAR(25) NOT NULL,
    processing_type VARCHAR(50) NOT NULL,
    output_consistency VARCHAR(50) NOT NULL,
    output_name VARCHAR(150),
    item_type VARCHAR(50),
    final_sku_or_mix VARCHAR(50),
    lot_num VARCHAR(50),
    special_directions VARCHAR(255),
    crc VARCHAR(50) NOT NULL,
    toll_processing_rate DECIMAL(10,2),
    received_qty_toll_proc_rate DECIMAL(10,2),
    invoice_num VARCHAR(100),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (intake_id) REFERENCES intakes (id)
);