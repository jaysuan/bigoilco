import axios from "axios";
import { getIdTokenHeader } from ".";

const apiUrl = process.env.VUE_APP_API_URL + "/v1/user";

async function getUsers() {
    return axios.get(apiUrl, {
        headers: await getIdTokenHeader()
    });
}

async function updateUser(uid, payload) {
    return axios.post(`${apiUrl}/${uid}`, payload, {
        headers: await getIdTokenHeader()
    });
}

export default {
    getUsers,
    updateUser
};
