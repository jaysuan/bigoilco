const db = require("../db");

async function fetchAll() {
    try {
        const pool = await db.init();
        const stmt = `SELECT id, first_name, last_name, email FROM sales_reps`;
        const results = await pool.query(stmt);
        console.info('Number of results: ', results.length);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    fetchAll
}