import axios from "axios";
import { getIdTokenHeader } from ".";

const apiUrl = process.env.VUE_APP_API_URL + "/v1/client";

async function getAllClients() {
    return axios.get(apiUrl, {
        headers: await getIdTokenHeader()
    });
}

async function getClientById(id) {
    return axios.get(`${apiUrl}/${id}`, {
        headers: await getIdTokenHeader()
    });
}

async function updateClient(id, updates) {
    const formData = getFormData(updates);
    return axios.patch(`${apiUrl}/${id}`, formData, await getHeader());
}

async function saveClient(client) {
    const formData = getFormData(client);
    return axios.post(apiUrl, formData, await getHeader());
}

async function getHeader() {
    const auth = await getIdTokenHeader();

    return {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${auth["Authorization"]}`
        }
    };
}

function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
        if (v) {
            formData.append(k, v);
        }
    });

    return formData;
}

export default {
    getAllClients,
    getClientById,
    updateClient,
    saveClient,
    getHeader
};
