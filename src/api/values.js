import axios from "axios";

const apiUrl = process.env.VUE_APP_API_URL + "/v1/values";

function getAll(type) {
    return axios.get(`${apiUrl}/${type}`);
}

function getByBatch(types) {
    return axios.get(`${apiUrl}/batch`, {
        params: {
            types: types.join(",")
        }
    });
}

function save(type, item) {
    return axios.post(`${apiUrl}/${type}`, item);
}

function deleteById(type, id) {
    return axios.delete(`${apiUrl}/${type}/${id}`);
}

export default {
    getAll,
    getByBatch,
    save,
    deleteById
};
