<template>
    <v-form class="intake" ref="intakeForm" v-model="validIntake">
        <v-container>
            <v-row dense>
                <v-col cols="12">
                    <v-card elevation="2">
                        <v-row class="pa-2" align="center" dense>
                            <v-col cols="auto">
                                <v-select
                                    v-model="selectedClient"
                                    :items="clients"
                                    :loading="loading"
                                    item-text="doing_business_as"
                                    return-object
                                    :rules="rules.client"
                                    hint="Client Name"
                                    persistent-hint
                                />
                            </v-col>
                            <v-spacer />
                        </v-row>
                        <v-row class="px-2" align="center" dense>
                            <v-col cols="4">
                                <!-- Origin DBA -->
                                <v-select
                                    v-model="selectedOriginDBA"
                                    :items="clients"
                                    :loading="loading"
                                    item-text="doing_business_as"
                                    item-value="doing_business_as"
                                    :rules="rules.originDBA"
                                    hint="Origin DBA"
                                    persistent-hint
                                />
                            </v-col>
                            <v-col cols="4">
                                <!-- Origin License Name -->
                                <v-select
                                    v-model="selectedOriginLicenseName"
                                    :items="clientsFilteredByDBA"
                                    item-text="licensed_business_name"
                                    item-value="licensed_business_name"
                                    :disabled="!selectedOriginDBA"
                                    :rules="rules.originLicenseName"
                                    hint="Origin License Name"
                                    persistent-hint
                                />
                            </v-col>
                            <v-col cols="4">
                                <!-- Origin License Number -->
                                <v-select
                                    v-model="selectedOriginLicenseNum"
                                    :items="clientsFilteredByLicenseName"
                                    item-text="license_num"
                                    item-value="license_num"
                                    :disabled="!selectedOriginLicenseName"
                                    :rules="rules.originLicenseNumber"
                                    hint="Origin License Number"
                                    persistent-hint
                                />
                            </v-col>
                        </v-row>
                        <v-row class="px-2 mb-4" align="center" dense>
                            <v-col cols="3">
                                <!-- Sales Rep -->
                                <v-select
                                    v-model="selectedSalesRep"
                                    :items="salesReps"
                                    item-text="first_name"
                                    return-object
                                    :rules="rules.salesRep"
                                    hint="Sales Rep"
                                    persistent-hint
                                />
                            </v-col>
                            <v-col cols="3">
                                <!-- Delivery Type -->
                                <v-select
                                    v-model="selectedDeliveryType"
                                    :items="deliveryTypes"
                                    :rules="rules.deliveryType"
                                    hint="Delivery Type"
                                    persistent-hint
                                />
                            </v-col>
                            <v-col cols="3">
                                <!-- Drop Off / Pickup Date -->
                                <v-dialog
                                    ref="datePickerDialog"
                                    v-model="showDatePickerDialog"
                                    :return-value.sync="deliveryDate"
                                    persistent
                                    width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="formattedDeliveryDate"
                                            prepend-icon="mdi-calendar"
                                            hint="Drop Off / Pickup Date"
                                            persistent-hint
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        />
                                    </template>
                                    <v-date-picker
                                        v-model="deliveryDate"
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="showDatePickerDialog = false"
                                        >
                                            Cancel
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.datePickerDialog.save(deliveryDate)"
                                        >
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-col>
                            <v-col cols="3">
                                <!-- Deal Type -->
                                <v-select
                                    v-model="selectedDealType"
                                    :items="dealTypes"
                                    item-text="name"
                                    item-value="name"
                                    :rules="rules.dealType"
                                    hint="Deal"
                                    persistent-hint
                                />
                            </v-col>
                        </v-row>
                        <v-row class="px-2" align="center" dense>
                            <v-col cols="4">
                                <v-textarea
                                    v-model="intakeNotes"
                                    label="Intake Notes"
                                    outlined
                                    no-resize
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-textarea
                                    v-model="dispatcherNotes"
                                    label="Dispatcher Notes"
                                    outlined
                                    no-resize
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-textarea
                                    v-model="bookKeeperNotes"
                                    label="Bookkeeper Notes"
                                    outlined
                                    no-resize
                                />
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            <span>Client Onboarding Info</span>
                            <v-spacer></v-spacer>
                            <v-btn v-if="clientContactModified && isEditingClient"
                                @click.stop="updateClient"
                                :loading="clientUpdateLoading"
                                icon>
                                <v-icon>mdi-content-save</v-icon>
                            </v-btn>
                            <v-btn icon @click="isEditingClient = !isEditingClient" :disabled="!clientToEdit">
                                <v-icon>{{ isEditingClient ? 'mdi-pencil-off' : 'mdi-pencil' }}</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="clientForm">
                                <v-row dense>
                                    <v-col cols="6">
                                        <v-container fluid>
                                            <v-row dense>
                                                <v-textarea
                                                    v-model="deliveryConstraints"
                                                    :disabled="!isEditingClient"
                                                    label="Delivery Constraints"
                                                    outlined
                                                    no-resize
                                                />
                                            </v-row>
                                            <v-row dense>
                                                <v-textarea
                                                    v-model="dispatcherDriverNotes"
                                                    :disabled="!isEditingClient"
                                                    label="Driver / Dispatcher Notes"
                                                    outlined
                                                    no-resize
                                                />
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-container>
                                            <v-row dense>Delivery Point of Contact</v-row>
                                            <v-row dense>
                                                <v-text-field
                                                    prepend-icon="mdi-account"
                                                    v-model.trim="deliveryContactName"
                                                    label="Name"
                                                    :disabled="!isEditingClient"
                                                />
                                            </v-row>
                                            <v-row dense>
                                                <v-text-field
                                                    prepend-icon="mdi-phone"
                                                    v-model.trim="deliveryContactPhone"
                                                    label="Phone"
                                                    :disabled="!isEditingClient"
                                                />
                                            </v-row>
                                            <v-row dense>
                                                <v-text-field
                                                    prepend-icon="mdi-email"
                                                    v-model.trim="deliveryContactEmail"
                                                    label="Email"
                                                    :disabled="!isEditingClient"
                                                />
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row dense class="mt-0">
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="px-4 pt-4 pb-2">
                            <v-row align="center" dense>
                                <!-- Fresh Total -->
                                <v-col cols="auto">
                                    <span class="subtitle-1 font-weight-medium">Fresh Total Quantity</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="caption font-weight-normal">{{ `${freshTotalInGrams.toFixed(2)} g` }}</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="caption font-weight-normal">{{ `${freshTotalInLbs.toFixed(2)} lbs` }}</span>
                                </v-col>

                                <!-- Leaf Total -->
                                <v-col cols="auto" class="ml-4">
                                    <span class="subtitle-1 font-weight-medium">Leaf Total Quantity</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="caption font-weight-normal">{{ `${leafTotalInGrams.toFixed(2)} g` }}</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="caption font-weight-normal">{{ `${leafTotalInLbs.toFixed(2)} lbs` }}</span>
                                </v-col>

                                <v-spacer></v-spacer>

                                <!-- Intake Item Dialog -->
                                <v-dialog
                                    v-model="intakeItemDialog.show"
                                    max-width="500px"
                                    :retain-focus="false"
                                    persistent>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            @click.stop="openIntakeItemDialog"
                                            v-bind="attrs"
                                            v-on="on"
                                            text>
                                            <v-icon>mdi-plus</v-icon>
                                            Add Item
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>New Intake Item</v-card-title>
                                        <v-card-text>
                                            <v-form v-model="validIntakeItem" ref="intakeItemForm">
                                                <v-container>
                                                    <v-row>
                                                        <v-text-field
                                                            v-model="editedItem.item_name"
                                                            :rules="rules.intakeItemName"
                                                            label="Item Name"
                                                        />
                                                    </v-row>
                                                    <v-row>
                                                        <v-text-field
                                                            v-model.number="editedItem.qty_grams"
                                                            :rules="rules.intakeItemQtyInGrams"
                                                            label="Quantity (g)"
                                                        />
                                                    </v-row>
                                                    <v-row>
                                                        <v-select
                                                            v-model="editedItem.fresh_or_leaf"
                                                            :items="['Fresh', 'Leaf']"
                                                            :rules="rules.freshOrLeaf"
                                                            label="Fresh / Leaf"
                                                        />
                                                    </v-row>
                                                    <v-row>
                                                        <v-select
                                                            v-model="editedItem.processing_type"
                                                            :items="['BHO', 'Solventless']"
                                                            :rules="rules.processingType"
                                                            label="Processing Type"
                                                        />
                                                    </v-row>
                                                    <v-row>
                                                        <v-select
                                                            v-model="editedItem.output_consistency"
                                                            :items="outputConsistencyItems"
                                                            item-text="name"
                                                            item-value="name"
                                                            :rules="rules.outputConsistency"
                                                            label="Output Consistency"
                                                        />
                                                    </v-row>
                                                    <v-row>
                                                        <v-text-field
                                                            v-model="editedItem.output_name"
                                                            label="Output Name"
                                                        />
                                                    </v-row>
                                                    <v-row>
                                                        <v-text-field
                                                            v-model="editedItem.special_directions"
                                                            label="Special Directions"
                                                        />
                                                    </v-row>
                                                    <v-row>
                                                        <v-select
                                                            v-model="editedItem.crc"
                                                            :items="['None', 'Regular', 'Light', 'Heavy']"
                                                            :rules="rules.crc"
                                                            label="CRC"
                                                        />
                                                    </v-row>
                                                </v-container>
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                :disabled="!validIntakeItem"
                                                @click.stop="saveIntakeItem">
                                                OK
                                            </v-btn>
                                            <v-btn text @click.stop="clearIntakeItemForm">Cancel</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-row>
                        </v-card-title>
                        <v-data-table
                            :headers="tableHeaders"
                            :items="intakeItems"
                            :items-per-page="10">
                            <template v-slot:item.actions="{ item }">
                                <v-icon small @click.stop="editIntakeItem(item)" class="mr-2">mdi-pencil</v-icon>
                                <v-icon small @click.stop="deleteIntakeItem(item)">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
            <v-row dense class="mb-1">
                <v-col cols="12">
                    <v-card elevation="2">
                        <v-row class="pa-2" align="center" dense>
                            <v-spacer />
                            <v-col cols="auto">
                                <v-btn color="error" @click.stop="clearForm">
                                    Clear
                                </v-btn>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn
                                    color="primary"
                                    :loading="submitting"
                                    @click.stop="saveIntake"
                                    :disabled="!(validIntake && intakeItems.length > 0)">
                                    Submit
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog
            v-model="confirmationDialog.show"
            max-width="500px">
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text>{{ confirmationDialog.message }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click.stop="confirmationDialog.callback">OK</v-btn>
                    <v-btn text @click.stop="closeConfirmationDialog">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
            v-model="snackbar.show"
            timeout="2500"
            bottom
        >
            {{ snackbar.message }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    color="red"
                    text
                    v-bind="attrs"
                    @click="snackbar.show = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-form>
</template>

<script>
import sumBy from "lodash/sumBy";
import { format, parse } from "date-fns";
import intakeApi from "@/api/intake";
import clientApi from "@/api/client";
import valuesApi from "@/api/values";

export default {
    name: "Intake",

    data() {
        return {
            clients: [],
            clientsFilteredByDBA: [],
            clientsFilteredByLicenseName: [],
            salesReps: [],
            dealTypes: [],
            deliveryTypes: ['Pickup', 'Drop Off'],
            selectedClient: {},
            selectedOriginDBA: '',
            selectedOriginLicenseName: '',
            selectedOriginLicenseNum: '',
            clientToEdit: null,
            selectedSalesRep: null,
            selectedDeliveryType: '',
            deliveryDate: format(new Date(), "yyyy-MM-dd"),
            selectedDealType: '',
            showDatePickerDialog: false,
            intakeNotes: '',
            dispatcherNotes: '',
            bookKeeperNotes: '',
            deliveryConstraints: '',
            dispatcherDriverNotes: '',
            deliveryContactName: '',
            deliveryContactPhone: '',
            deliveryContactEmail: '',
            intakeItems: [],
            editedItem: {},
            editedItemIdx: -1,
            outputConsistencyItems: [],
            isEditingClient: false,
            clientContactModified: false,
            tableHeaders: [
                {
                    text: 'Item Name',
                    align: 'start',
                    value: 'item_name'
                },    
                { text: 'Quantity (g)', value: 'qty_grams' },
                { text: 'Quantity (lbs)', value: 'qty_lbs' },
                { text: 'Fresh / Leaf', value: 'fresh_or_leaf' },
                { text: 'Processing Type', value: 'processing_type' },
                { text: 'Output Consistency', value: 'output_consistency' },
                { text: 'Output Name', value: 'output_name' },
                { text: 'Special Directions', value: 'special_directions' },
                { text: 'CRC', value: 'crc' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            loading: false,
            submitting: false,
            clientUpdateLoading: false,
            intakeItemDialog: {
                show: false,
                action: 'add'
            },
            rules: {
                client: [ v => !!v || 'Client is required' ],
                originDBA: [ v => !!v || 'Origin DBA is required' ],
                originLicenseName: [ v => !!v || 'Origin License Name is required' ],
                originLicenseNumber: [ v => !!v || 'Origin License Number is required' ],
                salesRep: [ v => !!v || 'Sales Rep is required' ],
                deliveryType: [  v => !!v || 'Delivery Type is required' ],
                deliveryDate: [  v => !!v || 'Drop Off / Pickup Date is required' ],
                dealType: [  v => !!v || 'Deal is required' ],

                intakeItemName: [ v => !!v && v.length > 0 || 'Item Name is required' ],
                intakeItemQtyInGrams: [ v => /^\d+(\.\d{1,2})?$/.test(v) || 'Invalid quantity' ],
                freshOrLeaf: [ v => !!v || 'Fresh / Leaf is required' ],
                processingType: [ v => !!v || 'Processing Type is required' ],
                outputConsistency: [ v => !!v || 'Output Consistency is required' ],
                crc: [ v => !!v || 'CRC is required' ],
            },
            validIntake: false,
            validIntakeItem: false,
            confirmationDialog: {
                show: false,
                message: '',
                callback: null
            },
            snackbar: {
                show: false,
                message: ''
            },
        }
    },

    computed: {
        formattedDeliveryDate() {
            const selectedDate = parse(this.deliveryDate, "yyyy-MM-dd", new Date());
            return format(selectedDate, "MM/dd/yyyy");
        },
        freshTotalInGrams() {
            return sumBy(this.intakeItems.filter(item => item.fresh_or_leaf === "Fresh"), "qty_grams");
        },
        freshTotalInLbs() {
            return sumBy(this.intakeItems.filter(item => item.fresh_or_leaf === "Fresh"), ({ qty_lbs }) => Number(qty_lbs));
        },
        leafTotalInGrams() {
            return sumBy(this.intakeItems.filter(item => item.fresh_or_leaf === "Leaf"), "qty_grams");
        },
        leafTotalInLbs() {
            return sumBy(this.intakeItems.filter(item => item.fresh_or_leaf === "Leaf"), ({ qty_lbs }) => Number(qty_lbs));
        }
    },

    watch: {
        selectedOriginDBA: function (val) {
            if (val) {
                this.clientsFilteredByDBA = this.clients.filter(client => client.doing_business_as === val);
            } else {
                this.clientsFilteredByDBA = [];
            }
            this.selectedOriginLicenseName = '';
            this.selectedOriginLicenseNum = '';
        },
        selectedOriginLicenseName: function (val) {
            if (val) {
                this.clientsFilteredByLicenseName = this.clientsFilteredByDBA.filter(client => client.licensed_business_name === val);
            } else {
                this.clientsFilteredByLicenseName = [];
            }
            this.selectedOriginLicenseNum = '';
        },
        selectedOriginLicenseNum: function (val) {
            if (val) {
                this.clientToEdit = this.clientsFilteredByLicenseName.find(client => client.license_num === val);
            }
        },
        clientToEdit: function (val) {
            if (val) {
                this.deliveryContactName = val.delivery_pickup_contact_name;
                this.deliveryContactPhone = val.delivery_pickup_contact_phone;
                this.deliveryContactEmail = val.delivery_pickup_contact_email;
                this.deliveryConstraints = val.delivery_pickup_constraints;
                this.dispatcherDriverNotes = val.dispatch_driver_notes;
            } else {
                this.deliveryContactName = null;
                this.deliveryContactPhone = null;
                this.deliveryContactEmail = null;
                this.deliveryConstraints = null;
                this.dispatcherDriverNotes = null;
            }
        },
        deliveryContactName: function (val) {
            this.setClientContactModified("delivery_pickup_contact_name", val);
        },
        deliveryContactPhone: function (val) {
            this.setClientContactModified("delivery_pickup_contact_phone", val);
        },
        deliveryContactEmail: function (val) {
            this.setClientContactModified("delivery_pickup_contact_email", val);
        },
        deliveryConstraints: function (val) {
            this.setClientContactModified("delivery_pickup_constraints", val);
        },
        dispatcherDriverNotes: function (val) {
            this.setClientContactModified("dispatch_driver_notes", val);
        }
    },

    methods: {
        async saveIntake() {
            try {
                this.submitting = true;
                const request = {
                    client_id: this.selectedClient.id,
                    sales_rep_id: this.selectedSalesRep.id,
                    origin_dba: this.selectedOriginDBA,
                    origin_license_name: this.selectedOriginLicenseName,
                    origin_license_num: this.selectedOriginLicenseNum,
                    origin_client_id: this.clientToEdit.id,
                    delivery_date: this.selectedDeliveryType === "Drop Off" ? this.formattedDeliveryDate : null,
                    pickup_date: this.selectedDeliveryType === "Pickup" ? this.formattedDeliveryDate : null,
                    type: this.selectedDeliveryType,
                    fresh_total_qty_grams: this.freshTotalInGrams,
                    fresh_total_qty_lbs: this.freshTotalInLbs,
                    leaf_total_qty_grams: this.leafTotalInGrams,
                    leaf_total_qty_lbs: this.leafTotalInLbs,
                    deal: this.selectedDealType,
                    intake_notes: this.intakeNotes,
                    dispatcher_notes: this.dispatcherNotes,
                    bookkeeper_notes: this.bookKeeperNotes,
                    items: this.intakeItems
                };
                console.info(request);
                const response = await intakeApi.insert(request);
                console.info("Intake saved: \n", response.data);
                this.showSnackbar("New intake saved");
            } catch (error) {
                if (error.response) {
                    console.error(error.response);
                }
                this.showSnackbar("An error occurred while saving new intake. Please try again later.");
            } finally {
                this.submitting = false;
                this.clearForm();
            }
        },
        async updateClient() {
            const { id } = this.clientToEdit;
            try {
                this.clientUpdateLoading = true;
                const response = await clientApi.updateClient(id,
                    {
                        delivery_pickup_constraints: this.deliveryConstraints,
                        delivery_pickup_contact_name: this.deliveryContactName,
                        delivery_pickup_contact_phone: this.deliveryContactPhone,
                        delivery_pickup_contact_email: this.deliveryContactEmail,
                        dispatch_driver_notes: this.dispatcherDriverNotes,
                    }
                );
                console.info(response.data);
                this.clientToEdit.delivery_pickup_constraints = this.deliveryConstraints;
                this.clientToEdit.delivery_pickup_contact_name = this.deliveryContactName;
                this.clientToEdit.delivery_pickup_contact_phone = this.deliveryContactPhone;
                this.clientToEdit.delivery_pickup_contact_email = this.deliveryContactEmail;
                this.clientToEdit.dispatch_driver_notes = this.dispatcherDriverNotes;
                this.isEditingClient = false;
                this.showSnackbar("Client updated");
            } catch (error) {
                this.showSnackbar("Error in updating client");
            } finally {
                this.clientUpdateLoading = false;
            }
        },
        setClientContactModified(prop, newValue) {
            if (newValue) {
                this.clientContactModified = this.clientToEdit[prop] !== newValue;
            } else {
                if (this.clientToEdit[prop]) {
                    this.clientContactModified = true;
                } else {
                    this.clientContactModified = false;
                }
            }
        },
        showSnackbar(message) {
            this.snackbar.message = message;
            this.snackbar.show = true;
        },
        openIntakeItemDialog() {
            this.intakeItemDialog.show = true;
            this.intakeItemDialog.action = "add";
        },
        editIntakeItem(item) {
            this.editedItemIdx = this.intakeItems.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.intakeItemDialog.show = true;
            this.intakeItemDialog.action = "edit";
        },
        saveIntakeItem() {
            if (this.intakeItemDialog.action === "add") {
                this.intakeItems.push({
                    qty_lbs: (this.editedItem.qty_grams * 0.00220462).toFixed(2),
                    ...this.editedItem
                });
            } else {
                if (this.editedItemIdx > -1) {
                    Object.assign(this.intakeItems[this.editedItemIdx], {
                        ...this.editedItem,
                        qty_lbs: (this.editedItem.qty_grams * 0.00220462).toFixed(2)
                    });
                }
            }
            this.clearIntakeItemForm();
        },
        deleteIntakeItem(item) {
            this.editedItemIdx = this.intakeItems.indexOf(item);
            const callback = () => {
                this.intakeItems.splice(this.editedItemIdx, 1);
                this.closeConfirmationDialog();
            };
            this.openConfirmationDialog("Delete this item?", callback);
        },
        openConfirmationDialog(message, callback) {
            this.confirmationDialog.show = true;
            this.confirmationDialog.message = message;
            this.confirmationDialog.callback = callback;
        },
        closeConfirmationDialog() {
            this.confirmationDialog.show = false;
            this.confirmationDialog.message = '';
            this.confirmationDialog.callback = null;
        },
        validateIntake() {
            this.$refs.intakeForm.validate();
        },
        clearForm() {
            this.$refs.intakeForm.reset();
            this.clientToEdit = null;
            this.intakeItems = [];
        },
        clearIntakeItemForm() {
            this.$refs.intakeItemForm.reset();
            this.editedItem = {};
            this.editedItemIdx = -1;
            this.intakeItemDialog.show = false;
            this.intakeItemDialog.action = "add";
        }
    },

    async mounted() {
        try {
            this.loading = true;
            const clientResponse = await clientApi.getAllClients();
            this.clients = clientResponse.data;
            const valuesResponse = await valuesApi.getByBatch(["sales_rep", "deal", "output_consistency"]);
            this.salesReps = valuesResponse.data["sales_rep"];
            this.dealTypes = valuesResponse.data["deal"];
            this.outputConsistencyItems = valuesResponse.data["output_consistency"];
        } catch (error) {
            console.error("Error in fetching data from server\n", error);
        } finally {
            this.loading = false;
        }
    },
}
</script>
