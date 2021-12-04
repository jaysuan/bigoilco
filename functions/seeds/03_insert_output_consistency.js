exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex("output_consistency").del()
        .then(() => {
            // Inserts seed entries
            return knex("output_consistency").insert([
                { "name" : "HCE" },
                { "name" : "Budder" },
                { "name" : "HTE\/Terps" },
                { "name" : "Sauce" },
                { "name" : "Badder (Connected)" },
                { "name" : "Diamonds" },
                { "name" : "Crumble" },
                { "name" : "1G Cart" },
                { "name" : "0.5G Cart" },
                { "name" : "0.6g Cart" },
                { "name" : "Fresh Press Rosin" },
                { "name" : "Water Hash" },
                { "name" : "Cold Cure Rosin Badder" },
                { "name" : "Rosin" }
            ]);
        });
};
