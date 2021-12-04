exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex("deal_types").del()
        .then(() => {
            // Inserts seed entries
            return knex("deal_types").insert([
                { "name" : "Toll-Processing" },
                { "name" : "Split-Processing" },
                { "name" : "Bear Collab" },
                { "name" : "Purchase" }
            ]);
        });
};
