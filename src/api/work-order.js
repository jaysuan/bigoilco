import axios from "axios";
import { getIdTokenHeader } from ".";

const apiUrl = process.env.VUE_APP_API_URL + "/v1/report/work-order";

async function getWorkOrders() {
    return axios.get(apiUrl, {
        headers: await getIdTokenHeader()
    });
}

async function generateWorkOrder(id) {
    return axios.post(`${apiUrl}/${id}`, {}, {
        headers: await getIdTokenHeader()
    });
}

export default {
    getWorkOrders,
    generateWorkOrder
}
