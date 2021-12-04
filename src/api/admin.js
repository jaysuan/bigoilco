import axios from "axios";
import { getIdTokenHeader } from ".";

const apiUrl = process.env.VUE_APP_API_URL + "/v1/audit";

async function getAuditLogs() {
    return axios.get(apiUrl, {
        headers: await getIdTokenHeader()
    });
}

export default {
    getAuditLogs
};
