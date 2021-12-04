const db = require("../db");

async function insert(auditLog) {
    try {
        const pool = await db.init();
        const stmt = "INSERT INTO audit_logs (name, email, action) values (?, ?, ?)";
        const { name, email, action } = auditLog;
        const { insertId } = await pool.query(stmt, [name, email, action]);
        auditLog.id = insertId;
        return auditLog;
    } catch (error) {
        console.error("[AuditLogRepository] Error in inserting audit log: ", error);
    }
}

async function fetch(opts) {
    try {
        const pool = await db.init();
        const offset = (opts.page - 1) * opts.resultsPerPage;
        const stmt = `
            SELECT id, name, email, action, date_created
            FROM audit_logs
            LIMIT ${opts.resultsPerPage}
            OFFSET ${offset}
            ORDER BY date_created ASC
        `;
        const results = await pool.query(stmt);
        console.info(`[AuditLogRepository] Number of results: ${results.length}`);
        return results;
    } catch (error) {
        console.error("[AuditLogRepository] Error in fetching audit logs");
        throw error;
    }
}

async function fetchAll() {
    try {
        const pool = await db.init();
        const stmt = `
            SELECT id, name, email, action, date_created
            FROM audit_logs
            ORDER BY date_created ASC
        `;
        const results = await pool.query(stmt);
        console.info(`[AuditLogRepository] Number of results: ${results.length}`);
        return results;
    } catch (error) {
        console.error("[AuditLogRepository] Error in fetching audit logs");
        throw error;
    }
}

module.exports = {
    insert,
    fetch,
    fetchAll
}
