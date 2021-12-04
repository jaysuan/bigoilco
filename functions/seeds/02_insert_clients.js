exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('clients').del()
        .then(() => {
            // Inserts seed entries
            return knex('clients').insert([
                {
                    "sales_rep_id": 1,
                    "licensed_business_name" : "Caps Apothecary, Inc",
                    "doing_business_as" : "BARE Dispensary",
                    "license_address" : "690 Garnet Ave",
                    "license_address_city" : "Palm Springs",
                    "license_address_state" : "CA",
                    "license_address_zip" : "92262",
                    "main_contact_name" : "Joel",
                    "main_contact_title" : "Purchase Manager",
                    "main_contact_phone" : "7606737400",
                    "email" : "baredispensary18@gmail.com",
                    "delivery_pickup_constraints" : "Monday - Friday 9am - 5:30pm",
                    "delivery_pickup_contact_name" : "Joel Diaz",
                    "delivery_pickup_contact_phone" : "7606737400",
                    "delivery_pickup_contact_email" : "bare.invoices@gmail.com",
                    "retail_locations" : "",
                    "dispatch_driver_notes" : "Take it easy",
                    "client_notes" : "",
                    "fulfillment_notes" : "",
                    "accounting_full_name" : "Garret R",
                    "accounting_phone" : "",
                    "accounting_email" : "garret@mankindcannabis.com",
                    "accounting_instructions" : "",
                    "payment_terms" : "",
                    "payment_type" : "",
                    "products_interested" : "Concentrates, flower, live resin",
                    "license_types" : "Retailer",
                    "license_num" : "C12-0000167-LIC",
                    "license_expiration" : "2021-07-10",
                    "license_file_1" : "https:\/\/drive.google.com\/open?id=1iU4P7F_8x6GNYm-jWHFt8NeLIkm5PDgZ",
                    "license_num_2": null,
                    "license_file_2" : null,
                    "license_num_3": null,
                    "license_file_3" : null,
                    "cdtfa_seller_permit_file" : "https:\/\/drive.google.com\/open?id=1aRSr13z80dQk2JMPCRB1aLihISj-63UB",
                    "cdtfa_seller_permit_num" : "103-225860",
                    "completed_w9" : "https:\/\/drive.google.com\/open?id=1sVwy__ltzVkGudt0wQfAfChXQC8p6CHL",
                    "metrc_contact_phone" : "",
                    "metrc_contact_email" : "",
                    "leaf_solventless_toll_proc_rate" : null,
                    "fresh_solventless_toll_proc_rate" : null,
                    "leaf_bho_toll_proc_rate" : null,
                    "fresh_bho_toll_proc_rate" : null,
                    "split_processing" : null,
                    "bear_labs_collab" : null,
                    "leaf_purchase_price_per_perc" : null,
                    "leaf_purchase_price_per_kg" : null,
                    "fresh_purchase_price_per_perc" : null,
                    "fresh_purchase_price_per_kg" : null
                },
                {
                    "sales_rep_id": 2,
                    "licensed_business_name" : "North Coast Wellbeing Inc",
                    "doing_business_as" : "Madrone",
                    "license_address" : "17975 N Hwy 1",
                    "license_address_city" : "Fort Bragg",
                    "license_address_state" : "CA",
                    "license_address_zip" : "95437",
                    "main_contact_name" : "Chris Mener",
                    "main_contact_title" : "Lead Accountant",
                    "main_contact_phone" : "7074099154",
                    "email" : "chris@madronecalifornia.com",
                    "delivery_pickup_constraints" : null,
                    "delivery_pickup_contact_name" : null,
                    "delivery_pickup_contact_phone" : null,
                    "delivery_pickup_contact_email" : null,
                    "retail_locations" : null,
                    "dispatch_driver_notes" : null,
                    "client_notes" : null,
                    "fulfillment_notes" : null,
                    "accounting_full_name" : null,
                    "accounting_phone" : "9512583305",
                    "accounting_email" : "chris@madronecalifornia.com",
                    "accounting_instructions" : null,
                    "payment_terms" : null,
                    "payment_type" : null,
                    "products_interested" : "Budder\/Sugar\/Shatter,Sauce\/Diamonds",
                    "license_types" : "Cultivator,Distributor",
                    "license_num" : "C11-0000649-LIC",
                    "license_expiration" : "2020-07-01",
                    "license_file_1" : "https:\/\/drive.google.com\/open?id=1uEL57Lf5ejsvjaxDvYjFMT1zhqqJ6Ona",
                    "license_num_2": null,
                    "license_file_2" : null,
                    "license_num_3": null,
                    "license_file_3" : null,
                    "cdtfa_seller_permit_file" : "https:\/\/drive.google.com\/open?id=1bw8x5iWDz1ZX2boLYXLuwv7B7oEukie3",
                    "cdtfa_seller_permit_num" : "AA 103-231598",
                    "completed_w9" : null,
                    "metrc_contact_phone" : null,
                    "metrc_contact_email" : null,
                    "leaf_solventless_toll_proc_rate" : null,
                    "fresh_solventless_toll_proc_rate" : null,
                    "leaf_bho_toll_proc_rate" : null,
                    "fresh_bho_toll_proc_rate" : null,
                    "split_processing" : null,
                    "bear_labs_collab" : null,
                    "leaf_purchase_price_per_perc" : null,
                    "leaf_purchase_price_per_kg" : null,
                    "fresh_purchase_price_per_perc" : null,
                    "fresh_purchase_price_per_kg" : null
                },
                {
                    "sales_rep_id": 3,
                    "licensed_business_name" : "Next Green Wave LLC",
                    "doing_business_as" : "Next Green Wave LLC",
                    "license_address" : "1920 Mercantile Ln",
                    "license_address_city" : "Coalinga",
                    "license_address_state" : "CA",
                    "license_address_zip" : "93210",
                    "main_contact_name" : "Nicole Hawley",
                    "main_contact_title" : "Operations Manager",
                    "main_contact_phone" : "619-244-1160",
                    "email" : "nhawley@nextgreenwave.com",
                    "delivery_pickup_constraints" : "M-F 9AM - 5PM",
                    "delivery_pickup_contact_name" : "Andy Dwyer",
                    "delivery_pickup_contact_phone" : "123-456",
                    "delivery_pickup_contact_email" : null,
                    "retail_locations" : null,
                    "dispatch_driver_notes" : null,
                    "client_notes" : null,
                    "fulfillment_notes" : null,
                    "accounting_full_name" : null,
                    "accounting_phone" : "312-998-9717",
                    "accounting_email" : "nhawley@nextgreenwave.com",
                    "accounting_instructions" : null,
                    "payment_terms" : null,
                    "payment_type" : null,
                    "products_interested" : "Trim byproduct",
                    "license_types" : "Cultivator",
                    "license_num" : "CCL19-0002587",
                    "license_expiration" : "2020-08-20",
                    "license_file_1" : "https:\/\/drive.google.com\/open?id=1Ox4BgalZviKs9AGcJKOs7RMUEaabcdag",
                    "license_num_2": null,
                    "license_file_2" : null,
                    "license_num_3": null,
                    "license_file_3" : null,
                    "cdtfa_seller_permit_file" : "https:\/\/drive.google.com\/open?id=1rWsXhLIKxcc1JpuYqxHgvZ_rDymL0OIB",
                    "cdtfa_seller_permit_num" : "AC 102-525337",
                    "completed_w9" : null,
                    "metrc_contact_phone" : null,
                    "metrc_contact_email" : null,
                    "leaf_solventless_toll_proc_rate" : null,
                    "fresh_solventless_toll_proc_rate" : null,
                    "leaf_bho_toll_proc_rate" : null,
                    "fresh_bho_toll_proc_rate" : null,
                    "split_processing" : null,
                    "bear_labs_collab" : null,
                    "leaf_purchase_price_per_perc" : null,
                    "leaf_purchase_price_per_kg" : null,
                    "fresh_purchase_price_per_perc" : null,
                    "fresh_purchase_price_per_kg" : null
                },
                {
                    "sales_rep_id": 3,
                    "licensed_business_name" : "Next Green Wave LLC",
                    "doing_business_as" : "Next Green Wave LLC",
                    "license_address" : "1920 Mercantile Ln",
                    "license_address_city" : "Coalinga",
                    "license_address_state" : "CA",
                    "license_address_zip" : "93210",
                    "main_contact_name" : "Nicole Hawley",
                    "main_contact_title" : "Operations Manager",
                    "main_contact_phone" : "619-244-1160",
                    "email" : "nhawley@nextgreenwave.com",
                    "delivery_pickup_constraints" : null,
                    "delivery_pickup_contact_name" : null,
                    "delivery_pickup_contact_phone" : null,
                    "delivery_pickup_contact_email" : null,
                    "retail_locations" : null,
                    "dispatch_driver_notes" : null,
                    "client_notes" : null,
                    "fulfillment_notes" : null,
                    "accounting_full_name" : null,
                    "accounting_phone" : "312-998-9717",
                    "accounting_email" : "nhawley@nextgreenwave.com",
                    "accounting_instructions" : null,
                    "payment_terms" : null,
                    "payment_type" : null,
                    "products_interested" : "Trim byproduct",
                    "license_types" : "Cultivator",
                    "license_num" : "CCL19-0002589",
                    "license_expiration" : "2020-08-20",
                    "license_file_1" : "https:\/\/drive.google.com\/open?id=1Ox4BgalZviKs9AGcJKOs7RMUEaabcdag",
                    "license_file_2" : null,
                    "license_file_3" : null,
                    "cdtfa_seller_permit_file" : "https:\/\/drive.google.com\/open?id=1rWsXhLIKxcc1JpuYqxHgvZ_rDymL0OIB",
                    "cdtfa_seller_permit_num" : "263524608-00001",
                    "completed_w9" : null,
                    "metrc_contact_phone" : null,
                    "metrc_contact_email" : null,
                    "leaf_solventless_toll_proc_rate" : null,
                    "fresh_solventless_toll_proc_rate" : null,
                    "leaf_bho_toll_proc_rate" : null,
                    "fresh_bho_toll_proc_rate" : null,
                    "split_processing" : null,
                    "bear_labs_collab" : null,
                    "leaf_purchase_price_per_perc" : null,
                    "leaf_purchase_price_per_kg" : null,
                    "fresh_purchase_price_per_perc" : null,
                    "fresh_purchase_price_per_kg" : null
                },
                {
                    "sales_rep_id": 3,
                    "licensed_business_name" : "Next Green Wave LLC",
                    "doing_business_as" : "Next Green Wave LLC",
                    "license_address" : "1920 Mercantile Ln",
                    "license_address_city" : "Coalinga",
                    "license_address_state" : "CA",
                    "license_address_zip" : "93210",
                    "main_contact_name" : "Nicole Hawley",
                    "main_contact_title" : "Operations Manager",
                    "main_contact_phone" : "619-244-1160",
                    "email" : "nhawley@nextgreenwave.com",
                    "delivery_pickup_constraints" : null,
                    "delivery_pickup_contact_name" : null,
                    "delivery_pickup_contact_phone" : null,
                    "delivery_pickup_contact_email" : null,
                    "retail_locations" : null,
                    "dispatch_driver_notes" : null,
                    "client_notes" : null,
                    "fulfillment_notes" : null,
                    "accounting_full_name" : null,
                    "accounting_phone" : "312-998-9717",
                    "accounting_email" : "nhawley@nextgreenwave.com",
                    "accounting_instructions" : null,
                    "payment_terms" : null,
                    "payment_type" : null,
                    "products_interested" : "Trim byproduct",
                    "license_types" : "Cultivator",
                    "license_num" : "CCL19-0002581",
                    "license_expiration" : "2020-08-20",
                    "license_file_1" : "https:\/\/drive.google.com\/open?id=1Ox4BgalZviKs9AGcJKOs7RMUEaabcdag",
                    "license_file_2" : null,
                    "license_file_3" : null,
                    "cdtfa_seller_permit_file" : "https:\/\/drive.google.com\/open?id=1rWsXhLIKxcc1JpuYqxHgvZ_rDymL0OIB",
                    "cdtfa_seller_permit_num" : "247047296-00001",
                    "completed_w9" : null,
                    "metrc_contact_phone" : null,
                    "metrc_contact_email" : null,
                    "leaf_solventless_toll_proc_rate" : null,
                    "fresh_solventless_toll_proc_rate" : null,
                    "leaf_bho_toll_proc_rate" : null,
                    "fresh_bho_toll_proc_rate" : null,
                    "split_processing" : null,
                    "bear_labs_collab" : null,
                    "leaf_purchase_price_per_perc" : null,
                    "leaf_purchase_price_per_kg" : null,
                    "fresh_purchase_price_per_perc" : null,
                    "fresh_purchase_price_per_kg" : null
                }
            ]);
        });
};