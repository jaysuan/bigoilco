exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex("crc").del()
        .then(() => {
            // Inserts seed entries
            return knex("crc").insert([
                { "name" : "None" },
                { "name" : "Regular" },
                { "name" : "Light" },
                { "name" : "Heavy" }
            ]);
        });
};
