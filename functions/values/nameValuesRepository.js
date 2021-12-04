const db = require("../db");

const repository = (table) => {
    async function fetchAll() {
        try {
            const pool = await db.init();
            const stmt = `SELECT id, name FROM ${table}`;
            const results = await pool.query(stmt);
            console.info("Number of results: ", results.length);
            return results;
        } catch (error) {
            console.error(`[NameValuesRepository] Error in getting values from ${table}`);
            throw error;
        }
    }

    async function insert(name) {
        try {
            const pool = await db.init();
            const stmt = `INSERT INTO ${table} (name) VALUES (?)`;
            const { insertId } = await pool.query(stmt, [name]);
            console.info(`New item inserted in ${table}: '${name}' with ID ${insertId}`);
            return insertId;
        } catch (error) {
            console.error(`[NameValuesRepository] Error in inserting new item '${name}'`);
            throw error;
        }
    }

    async function deleteById(id) {
        try {
            const pool = await db.init();
            const stmt = `DELETE FROM ${table} WHERE id = ?`;
            const result = await pool.query(stmt, [id]);
            return result;
        } catch (error) {
            console.error(`[NameValuesRepository] Error in deleting #${id} from '${table}'`);
            throw error;
        }
    }

    return {
        fetchAll,
        insert,
        deleteById
    }
}

module.exports = repository;
