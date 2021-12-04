exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex("sales_reps").del()
        .then(() => {
            // Inserts seed entries
            return knex("sales_reps").insert([
                {
                    "first_name" : "SalesRep1",
                    "last_name" : "Sales1",
                    "email" : "sales1@bigoilco.com"
                },
                {
                    "first_name" : "SalesRep2",
                    "last_name" : "Sales2",
                    "email" : "sales2@bigoilco.com"
                },
                {
                    "first_name" : "SalesRep3",
                    "last_name" : "Sales3",
                    "email" : "sales3@bigoilco.com"
                }
            ]);
        });
};
