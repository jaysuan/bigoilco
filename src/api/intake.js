import axios from "axios";
import { getIdTokenHeader } from ".";

const apiUrl = process.env.VUE_APP_API_URL + '/v1/intake';

async function insert(intake) {
    return axios.post(apiUrl, intake, {
        headers: await getIdTokenHeader()
    });
}

function getAllIntakeDetails() {
    return axios.get(apiUrl);
}

async function getIntakesToDispatch() {
    return axios.get(`${apiUrl}/dispatch/pickup`, {
        headers: await getIdTokenHeader()
    });
}

async function getIntakesScheduledPickup() {
    return axios.get(`${apiUrl}/dispatch/pickup/schedule`, {
        headers: await getIdTokenHeader()
    });
}

async function setPickupSchedule(intakes) {
    return axios.post(`${apiUrl}/dispatch/pickup/schedule`,
        intakes.map(({ id, scheduled_pickup_date }) =>
            ({
                id,
                scheduled_pickup_date
            })
        ),
        {
            headers: await getIdTokenHeader()
        }
    );
}

async function setActualPickupDate(intakes) {
    return axios.post(`${apiUrl}/dispatch/pickup/actual`,
        intakes.map(({ id, actual_pickup_date }) =>
            ({
                id,
                actual_pickup_date
            })
        ),
        {
            headers: await getIdTokenHeader()
        }
    );
}

async function getIntakesForManager() {
    return axios.get(`${apiUrl}/manager`, {
        headers: await getIdTokenHeader()
    });
}

async function saveIntakeFromManager(intake) {
    return axios.post(`${apiUrl}/manager`,
        {
            id: intake.id,
            manifest_num: intake.manifest_num,
            items: intake.items.map(item => {
                if (item.id) {
                    return  {
                        id: item.id,
                        metrc_uid: item.metrc_uid,
                        metrc_qty_grams: item.metrc_qty_grams,
                        received_qty_grams: item.received_qty_grams,
                        metrc_received_discrepancy_grams: item.metrc_received_discrepancy_grams,
                        metrc_received_discrepancy_perc: item.metrc_received_discrepancy_perc,
                        item_type: item.item_type,
                        final_sku_or_mix: item.final_sku_or_mix,
                        lot_num: item.lot_num
                    }
                } else {
                    return {
                        item_name: item.item_name,
                        qty_grams: item.qty_grams,
                        qty_lbs: item.qty_lbs,
                        fresh_or_leaf: item.fresh_or_leaf,
                        processing_type: item.processing_type,
                        output_consistency: item.output_consistency,
                        output_name: item.output_name,
                        special_directions: item.special_directions,
                        crc: item.crc,
                        metrc_uid: item.metrc_uid,
                        metrc_qty_grams: item.metrc_qty_grams,
                        received_qty_grams: item.received_qty_grams,
                        metrc_received_discrepancy_grams: item.metrc_received_discrepancy_grams,
                        metrc_received_discrepancy_perc: item.metrc_received_discrepancy_perc,
                        item_type: item.item_type,
                        final_sku_or_mix: item.final_sku_or_mix,
                        lot_num: item.lot_num
                    }
                }
            }),
            items_to_delete: intake.itemsToDelete.map(item => ({
                id: item.id
            }))
        },
        {
            headers: await getIdTokenHeader()
        }
    );
}

async function saveIntakeDraft(intake) {
    return axios.post(`${apiUrl}/manager/draft`,
        {
            id: intake.id,
            manifest_num: intake.manifest_num,
            items: intake.items.map(item => {
                if (item.id) {
                    return  {
                        id: item.id,
                        metrc_uid: item.metrc_uid,
                        metrc_qty_grams: item.metrc_qty_grams,
                        received_qty_grams: item.received_qty_grams,
                        metrc_received_discrepancy_grams: item.metrc_received_discrepancy_grams,
                        metrc_received_discrepancy_perc: item.metrc_received_discrepancy_perc,
                        item_type: item.item_type,
                        final_sku_or_mix: item.final_sku_or_mix,
                        lot_num: item.lot_num
                    }
                } else {
                    return {
                        item_name: item.item_name,
                        qty_grams: item.qty_grams,
                        qty_lbs: item.qty_lbs,
                        fresh_or_leaf: item.fresh_or_leaf,
                        processing_type: item.processing_type,
                        output_consistency: item.output_consistency,
                        output_name: item.output_name,
                        special_directions: item.special_directions,
                        crc: item.crc,
                        metrc_uid: item.metrc_uid,
                        metrc_qty_grams: item.metrc_qty_grams,
                        received_qty_grams: item.received_qty_grams,
                        metrc_received_discrepancy_grams: item.metrc_received_discrepancy_grams,
                        metrc_received_discrepancy_perc: item.metrc_received_discrepancy_perc,
                        item_type: item.item_type,
                        final_sku_or_mix: item.final_sku_or_mix,
                        lot_num: item.lot_num
                    }
                }
            }),
            items_to_delete: intake.itemsToDelete.map(item => ({
                id: item.id
            }))
        },
        {
            headers: await getIdTokenHeader()
        }
    );
}

export default {
    insert,
    getAllIntakeDetails,
    getIntakesToDispatch,
    getIntakesScheduledPickup,
    setPickupSchedule,
    setActualPickupDate,
    getIntakesForManager,
    saveIntakeFromManager,
    saveIntakeDraft
}
