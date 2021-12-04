const mysql = require("promise-mysql");
const functions = require("firebase-functions");

console.debug(`Current environment: ${functions.config().db.env}`);
let connectConfig;
if (functions.config().db.env === "local") {
    connectConfig = {
        host: functions.config().db.host,
        port: functions.config().db.port,
    }
} else {
    connectConfig = {
        socketPath: functions.config().db.socketpath,
    }
}

async function createPool() {
    return mysql.createPool({
        ...connectConfig,
        user: functions.config().db.user,
        password: functions.config().db.password,
        database: functions.config().db.database,
        connectionLimit: 10,
        connectTimeout: 10000,
        waitForConnections: true,
        dateStrings: true,
        timezone: "+00:00"
    });
}

let pool;
async function init() {
    if (!pool) {
        pool = await createPool();
    }
    return pool;
}

/**
 * A simple function to wrap transactions.
 * Transaction will commit when no errors,
 * otherwise rollback.
 */
function beginTx(currentPool) {
    return async (action) => {
        const conn = await currentPool.getConnection();
        try {
            console.info("Begin transaction");
            await conn.beginTransaction();
            const result = await action(conn);
            await conn.commit();
            console.info("Transaction committed");
            return result;
        } catch(error) {
            console.error(error);
            console.info("Rolling back transaction");
            await conn.rollback();
            throw error;
        }
    }
}

module.exports = {
    init,
    beginTx
}
