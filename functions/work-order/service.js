const functions = require("firebase-functions");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const drive = google.drive("v3");
const { formatDate } = require("../util").datetime;

async function setupAuth() {
    const scopes = [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets"
    ];
    
    const auth = await google.auth.getClient({
        scopes
    });
    google.options({
        auth
    });
}

const templateId = functions.config().googleapi.workorder.template;
const outDir = functions.config().googleapi.workorder.outdir;

async function generateWorkOrder(details, ingredients) {
    try {
        await setupAuth();
        const {
            client_name,
            sales_rep,
            manifest_num,
            metrc_uid,
            item_name,
            item_type,
            output_consistency,
            processing_type,
            lot_num,
            qty_grams,
            date_created
        } = details;
        const value_1 = `Desired Consistency: ${output_consistency}\nProcessing Type: ${processing_type}`;
        const value_2 = `UID:${metrc_uid}
        LOT #:${lot_num}
        ${qty_grams} g
        ${client_name}`;

        const tempSpreadsheetId = await createTempSheet(metrc_uid);
        const type = item_type === "SKU" ? "sku" : "mix"
        
        console.info("Updating work order template");
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: tempSpreadsheetId,
            requestBody: {
                valueInputOption: "USER_ENTERED",
                data: [
                    {
                        range: `${type}_value_1`,
                        values: [[ value_1 ]]
                    },
                    {
                        range: `${type}_value_2`,
                        values: [[ value_2 ]]
                    },
                    {
                        range: `${type}_item_name`,
                        values: [[ item_name ]]
                    },
                    {
                        range: `${type}_date`,
                        values: [[ `Date: ${formatDate(date_created)}` ]]
                    },
                    {
                        range: `${type}_salesman`,
                        values: [[ `Salesman: ${sales_rep}` ]]
                    },
                    {
                        range: `${type}_manifest_num`,
                        values: [[ `Manifest #: ${manifest_num}` ]]
                    },
                ]
            }
        });

        if (item_type === "Mix") {
            // assert ingredients must not be empty
            if (!ingredients)
                throw Error("Programming Error: If type is Mix, ingredients must not be empty");

            console.info(`Number of ingredients: ${ingredients.length}`);
            const rowValues = ingredients.map(item => [item.metrc_uid, "", item.item_name, "", item.qty_grams]);
            console.info("Row values: ", rowValues);

            // add ingredients
            await sheets.spreadsheets.values.append({
                spreadsheetId: tempSpreadsheetId,
                range: "mix_ingredients",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    range: "mix_ingredients",
                    values: rowValues
                }
            });

            const spreadsheet = (await sheets.spreadsheets.get({
                spreadsheetId: tempSpreadsheetId
            })).data;

            const mixSheet = spreadsheet.sheets[1];
            const { sheetId } = mixSheet.properties;
            const { chartId } = mixSheet.charts[0];

            // update chart
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: tempSpreadsheetId,
                requestBody: {
                    requests: [
                        {
                            updateChartSpec: {
                                chartId,
                                spec: {
                                    title: "STRAIN CONTENTS:",
                                    pieChart: {
                                        legendPosition: "LEFT_LEGEND",
                                        domain: {
                                            sourceRange: {
                                                sources: [
                                                    {
                                                        sheetId,
                                                        startRowIndex: 20,
                                                        endRowIndex: 20 + rowValues.length,
                                                        startColumnIndex: 4,
                                                        endColumnIndex: 5
                                                    }
                                                ]
                                            }
                                        },
                                        series: {
                                            sourceRange: {
                                                sources: [
                                                    {
                                                        sheetId,
                                                        startRowIndex: 20,
                                                        endRowIndex: 20 + rowValues.length,
                                                        startColumnIndex: 6,
                                                        endColumnIndex: 7
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    hiddenDimensionStrategy: "SKIP_HIDDEN_ROWS_AND_COLUMNS",
                                    titleTextFormat: {
                                        fontFamily: "Roboto"
                                    },
                                    fontName: "Roboto"
                                }
                            }
                        }
                    ]
                }
            })
        }

        return {
            template_id: tempSpreadsheetId
        };
    } catch (error) {
        console.error("Error in exporting work order");
        throw error;
    }
}

async function exportToPdf(spreadsheetId) {
    try {
        const response = await drive.files.export({
            fileId: spreadsheetId,
            mimeType: "application/pdf"
        });
        return response.data;
    } catch (error) {
        console.error("Error exporting to PDF");
        throw error;
    }
}

async function createTempSheet(metrc_uid) {
    try {
        const response = await drive.files.copy({
            fileId: templateId,
            requestBody: {
                name: metrc_uid,
                parents: [ outDir ]    // Google Drive folder ID
            }
        });
        const { id } = response.data;
        console.info(`Temporary spreadsheet ID: ${id}`);

        return id;
    } catch (error) {
        console.error("Error in creating temporary spreadsheet");
        throw error;
    }
}

async function deleteTempSheet(spreadsheetId) {
    try {
        console.info(`Deleting temporary spreadsheet ${spreadsheetId}`);
        await drive.files.delete({
            fileId: spreadsheetId
        });
    } catch (error) {
        console.error("Error in deleting temporary spreadsheet. Do cleanup manually.");
    }
}

module.exports = {
    generateWorkOrder,
    exportToPdf
}
