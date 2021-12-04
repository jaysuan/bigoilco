-- This SQL script is for development use only

-- insert deal types
INSERT INTO deal_types (name) VALUES ('Toll-Processing'), ('Split-Processing'), ('Bear Collab'), ('Purchase');

-- insert sales rep
INSERT INTO sales_reps (first_name, last_name, email) VALUES
	('SalesRep1', 'Sales1', 'sales1@bigoilco.com'),
	('SalesRep2', 'Sales2', 'sales2@bigoilco.com'),
	('SalesRep3', 'Sales3', 'sales3@bigoilco.com');

INSERT INTO output_consistency (name) VALUES
	('HCE'), ('Budder'), ('HTE/Terps'), ('Sauce'), ('Badder (Connected)'), ('Diamonds'), ('Crumble'), ('1G Cart'),
	('0.5G Cart'), ('0.6g Cart'), ('Fresh Press Rosin'), ('Water Hash'), ('Cold Cure Rosin Badder'), ('Rosin');

INSERT INTO crc (name) VALUES ('None'), ('Regular'), ('Light'), ('Heavy');


-- insert clients
INSERT INTO clients
	(licensed_business_name, doing_business_as, license_address, license_address_city, license_address_state, license_address_zip, main_contact_name,
	main_contact_title, main_contact_phone, email, delivery_pickup_constraints, delivery_pickup_contact_name, delivery_pickup_contact_phone, delivery_pickup_contact_email,
	retail_locations, dispatch_driver_notes, client_notes, fulfillment_notes, accounting_full_name, accounting_phone, accounting_email, accounting_instructions,
	payment_terms, payment_type, products_interested, license_type, license_num, license_expiration, license_file_1, license_file_2, license_file_3,
	cdtfa_seller_permit_file, cdtfa_seller_permit_num, completed_w9, metrc_contact_phone , metrc_contact_email,
	leaf_solventless_toll_proc_rate, fresh_solventless_toll_proc_rate, leaf_bho_toll_proc_rate, fresh_bho_toll_proc_rate, split_processing, bear_labs_collab,
	leaf_purchase_price_per_perc, leaf_purchase_price_per_kg, fresh_purchase_price_per_perc, fresh_purchase_price_per_kg 
	)
VALUES 
	('Caps Apothecary, Inc', 'BARE Dispensary', '690 Garnet Ave', 'Palm Springs', 'CA', '92262', 'Joel',
	'Purchase Manager', '7606737400', 'baredispensary18@gmail.com', 'Monday - Friday 9am - 3:30pm', 'Joel Diaz', '7606737400', 'bare.invoices@gmail.com',
	'', '', '', '', 'Garret R', '', 'garret@mankindcannabis.com', '',
	'', '', 'Concentrates, flower, live resin', 'Retailer', 'C12-0000167-LIC', STR_TO_DATE('7/10/2021','%m/%d/%Y'), 'https://drive.google.com/open?id=1iU4P7F_8x6GNYm-jWHFt8NeLIkm5PDgZ', '', '',
	'https://drive.google.com/open?id=1aRSr13z80dQk2JMPCRB1aLihISj-63UB', '103-225860', 'https://drive.google.com/open?id=1sVwy__ltzVkGudt0wQfAfChXQC8p6CHL', '', '',
	NULL, NULL, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NULL
	)