<template>
    <v-form class="intakeManager" ref="intakeManagerForm" v-model="validIntake">
        <v-container fluid>
            <!-- General Info -->
            <v-row dense>
                <v-col cols="12">
                    <v-card>
                        <v-row dense align="center" class="pa-2">
                            <v-col cols="3">
                                <v-select
                                    v-model="intake"
                                    :items="intakeSelections"
                                    :loading="loadingIntakes"
                                    hint="Intake ID"
                                    persistent-hint
                                />
                            </v-col>
                            <v-col cols="1.5">
                                <v-list-item two-line>
                                    <v-list-item-content>
                                        <v-list-item-title>Client Name</v-list-item-title>
                                        <v-skeleton-loader v-if="loadingIntakes" type="list-item" elevation="0" />
                                        <v-list-item-subtitle v-else>{{ intake ? intake.client_name : "N/A" }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                            <v-col cols="1.5">
                                <v-list-item two-line>
                                    <v-list-item-content>
                                        <v-list-item-title>Origin DBA</v-list-item-title>
                                        <v-skeleton-loader v-if="loadingIntakes" type="list-item" elevation="0" />
                                        <v-list-item-subtitle v-else>{{ intake ? intake.origin_dba : "N/A" }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                            <v-col cols="1.5">
                                <v-list-item two-line>
                                    <v-list-item-content>
                                        <v-list-item-title>Origin License Name</v-list-item-title>
                                        <v-skeleton-loader v-if="loadingIntakes" type="list-item" elevation="0" />
                                        <v-list-item-subtitle v-else>{{ intake ? intake.origin_license_name : "N/A" }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                            <v-col cols="1.5">
                                <v-list-item two-line>
                                    <v-list-item-content>
                                        <v-list-item-title>Origin License #</v-list-item-title>
                                        <v-skeleton-loader v-if="loadingIntakes" type="list-item" elevation="0" />
                                        <v-list-item-subtitle v-else>{{ intake ? intake.origin_license_num : "N/A" }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12">
                    <v-card>
                        <v-row no-gutters align="center" class="pa-2">
                            <v-col cols="6">
                                <v-select
                                    :items="manifestNums"
                                    :value="manifestNums"
                                    hint="Manifest #"
                                    persistent-hint
                                    chips
                                    deletable-chips
                                    disable-lookup
                                    multiple
                                    hide-no-data
                                    hide-selected
                                    readonly
                                    append-icon="">
                                    <template v-slot:selection="data">
                                        <v-chip
                                            v-bind="data.attrs"
                                            @click="data.select"
                                            @click:close="removeManifestNum(data.item)"
                                            close>
                                            {{ data.item }}
                                        </v-chip>
                                    </template>
                                </v-select>
                            </v-col>

                            <!-- Add Manifest # -->
                            <v-col cols="auto">
                                <v-dialog
                                    v-model="showManifestDialog"
                                    max-width="300"
                                    persistent>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            v-bind="attrs"
                                            v-on="on"
                                            icon>
                                            <v-icon @click.stop="showManifestDialog = !showManifestDialog">mdi-plus</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>Input Manifest #</v-card-title>
                                        <v-card-text>
                                            <v-text-field v-model="inputManifestNum"/>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                @click.stop="addManifestNum"
                                                :disabled="!inputManifestNum"
                                                text>OK</v-btn>
                                            <v-btn
                                                @click.stop="showManifestDialog = false"
                                                text>Cancel</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-col>
                            <v-spacer></v-spacer>

                            <!-- Save -->
                            <v-col cols="auto">
                                <v-btn
                                    @click.stop="saveDraft"
                                    :loading="savingDraft"
                                    :disabled="!intake"
                                    color="success">Save</v-btn>
                            </v-col>

                            <!-- Submit -->
                            <v-col cols="auto" class="ml-2">
                                <v-btn color="primary"
                                    @click.stop="showSubmitPreview = true"
                                    :loading="submitting"
                                    :disabled="!(intake && manifestNums.length > 0 && validIntake && intakeItems.length > 0)">
                                    <v-icon left>mdi-send</v-icon>
                                    Submit
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Intake Notes -->
            <v-row v-if="intake && intake.intake_notes" no-gutters class="mt-1">
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="body-2 font-weight-medium">Intake Notes</v-card-title>
                        <v-card-text class="error--text body-2 font-weight-regular">{{ intake.intake_notes }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row dense class="mt-0">
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="px-4">
                            <v-row align="center" dense>
                                <!-- Total Quantity -->
                                <v-col cols="auto">
                                    <span class="subtitle-1 font-weight-medium">Total Quantity</span>
                                </v-col>
                                <v-col cols="auto" class="mr-1">
                                    <span class="caption font-weight-normal">{{ `${totalQtyGrams.toFixed(2)} g` }}</span>
                                </v-col>
                                <v-col cols="auto" class="mr-2">
                                    <span class="caption font-weight-normal">{{ `${totalQtyLbs.toFixed(2)} lbs` }}</span>
                                </v-col>

                                <!-- METRC Quantity (g) -->
                                <v-col cols="auto">
                                    <span class="subtitle-1 font-weight-medium">METRC Quantity (g)</span>
                                </v-col>
                                <v-col cols="auto" class="mr-2">
                                    <span class="caption font-weight-normal">{{ `${metrcTotalQty.toFixed(2)} g` }}</span>
                                </v-col>

                                <!-- Received Quantity (g) -->
                                <v-col cols="auto">
                                    <span class="subtitle-1 font-weight-medium">Received Quantity (g)</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="caption font-weight-normal">{{ `${receivedTotalQty.toFixed(2)} g` }}</span>
                                </v-col>

                                <v-spacer></v-spacer>

                                <v-dialog
                                    v-model="itemDialog.show"
                                    max-width="500px"
                                    :retain-focus="false"
                                    persistent>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            @click.stop="addNewItem"
                                            :disabled="!intake"
                                            v-bind="attrs"
                                            v-on="on"
                                            text>
                                            <v-icon>mdi-plus</v-icon>
                                            Add Item
                                        </v-btn>
                                    </template>
                                    <IntakeItemForm
                                        v-model="editedItem"
                                        @click:ok="saveItem"
                                        @click:cancel="closeItemDialog"
                                        :title="`${itemDialog.action === 'add' ? 'New' : 'Edit'} Intake Item`"
                                        item-type-selection />
                                </v-dialog>
                            </v-row>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-data-table
                            :items="intakeItems"
                            :headers="tableHeaders">
                            <!-- Work Order -->
                            <template v-slot:item.work_order="{ item }">
                                <v-icon
                                    v-if="item.item_type === 'SKU' || item.item_type === 'Mix'"
                                    color="success">
                                    mdi-check
                                </v-icon>
                            </template>

                            <!-- METRC UID -->
                            <template v-slot:item.metrc_uid="{ item }">
                                <v-text-field
                                    v-model.trim="item.metrc_uid"
                                    :rules="rules.metrcUID(item)" />
                            </template>

                            <!-- Quantity (g) -->
                            <template v-slot:item.qty_grams="{ item }">
                                <span>{{ `${item.qty_grams.toFixed(2)} g` }}</span>
                            </template>

                            <!-- Quantity (lbs) -->
                            <template v-slot:item.qty_lbs="{ item }">
                                <span>{{ `${item.qty_lbs.toFixed(2)} lbs` }}</span>
                            </template>

                            <!-- METRC Quantity -->
                            <template v-slot:item.metrc_qty_grams="{ item }">
                                <v-text-field
                                    v-model.number="item.metrc_qty_grams"
                                    :rules="rules.metrcQty"
                                    class="item-input" />
                            </template>

                            <!-- Received Quantity -->
                            <template v-slot:item.received_qty_grams="{ item }">
                                <v-text-field
                                    v-model.number="item.received_qty_grams"
                                    :disabled="!item.metrc_qty_grams"
                                    @input="calculateDiscrepancy(item)"
                                    :rules="rules.receivedQty"
                                    class="item-input" />
                            </template>

                            <!-- METRC vs Received Discrepancy (%) -->
                            <template v-slot:item.metrc_received_discrepancy_grams="{ item }">
                                <span>
                                    {{ `${item.metrc_received_discrepancy_grams || 0} g` }}
                                </span>
                            </template>

                            <!-- METRC vs Received Discrepancy (%) -->
                            <template v-slot:item.metrc_received_discrepancy_perc="{ item }">
                                <span :class="(item.metrc_received_discrepancy_perc > 0.1) ? 'error--text' : ''">
                                    {{ displayDiscrepancyPerc(item.metrc_received_discrepancy_perc) }}
                                </span>
                            </template>

                            <!-- Item Type -->
                            <template v-slot:item.item_type="{ item }">
                                <v-text-field
                                    v-if="item.item_type === 'Mix'"
                                    v-model.trim="item.item_type"
                                    readonly
                                    class="item-input" />
                                <v-select
                                    v-else
                                    v-model.trim="item.item_type"
                                    :items="['SKU', 'Ingredient']"
                                    :rules="rules.itemType"
                                    class="item-input" />
                            </template>

                            <!-- Final SKU / Mix -->
                            <template v-slot:item.final_sku_or_mix="{ item }">
                                <v-select
                                    v-if="item.item_type === 'Ingredient' || item.item_type === 'Mix'"
                                    v-model.trim="item.final_sku_or_mix"
                                    :value="item.final_sku_or_mix"
                                    :readonly="item.item_type === 'Mix'"
                                    :items="mixSelection"
                                    :rules="rules.mix"
                                    no-data-text="No Mix item yet"
                                    class="item-input" />
                                <v-text-field
                                    v-else
                                    v-model.trim="item.final_sku_or_mix"
                                    readonly
                                    class="item-input" />
                            </template>

                            <!-- LOT # -->
                            <template v-slot:item.lot_num="{ item }">
                                <v-text-field
                                    v-model.trim="item.lot_num"
                                    class="item-input" />
                            </template>

                            <template v-slot:item.actions="{ item }">
                                <v-icon small @click.stop="editItem(item)" class="mr-2">mdi-pencil</v-icon>
                                <v-icon small @click.stop="deleteItem(item)">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <ConfirmationDialog
            v-model="confirmationDialog.show"
            :title="confirmationDialog.title"
            :message="confirmationDialog.message"
            @click:ok="confirmationDialog.okAction"
            @click:cancel="confirmationDialog.cancelAction "/>
        <SnackbarAlert
            v-model="snackbar" />
        <v-dialog
            v-model="showSubmitPreview"
            width="500"
            persistent>
            <v-card>
                <v-card-title class="card-header">Items Ready For Work Order</v-card-title>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-list-item v-for="item in workOrderItems" :key="item.metrc_uid">
                                <v-list-item-content>
                                    <v-list-item-title>{{ item.item_name }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click.stop="submit"
                        text>
                        Submit
                    </v-btn>
                    <v-btn
                        @click.stop="showSubmitPreview = false"
                        text>
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import IntakeItemForm from "@/components/IntakeItemForm";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import SnackbarAlert from "@/components/base/SnackbarAlert";
import intakeApi from "@/api/intake";
import { padID } from "@/util";

export default {
    name: "IntakeManager",

    components: {
        IntakeItemForm,
        ConfirmationDialog,
        SnackbarAlert
    },

    data() {
        return {
            intakeId: "",
            intake: null,
            loadingIntakes: false,
            showManifestDialog: false,
            inputManifestNum: null,
            savingDraft: false,
            tableHeaders: [
                { text: "Work Order", value: "work_order", align: "center", width: "75px", sortable: false },
                { text: "METRC UID", value: "metrc_uid", align: "center", width: "275px", sortable: false },
                { text: "Item Name", value: "item_name", align: "center", width: "150px", sortable: false },
                { text: "Quantity (g)", value: "qty_grams", align: "center", width: "100px", sortable: false },
                { text: "Quantity (lbs)", value: "qty_lbs", align: "center", width: "100px", sortable: false },
                { text: "METRC Quantity (g)", value: "metrc_qty_grams", align: "center", width: "150px", sortable: false },
                { text: "Received Quantity (g)", value: "received_qty_grams", align: "center", width: "150px", sortable: false },
                { text: "METRC vs Received Discrepancy (g)", value: "metrc_received_discrepancy_grams", align: "center", width: "100px", sortable: false },
                { text: "METRC vs Received Discrepancy (%)", value: "metrc_received_discrepancy_perc", align: "center", width: "100px", sortable: false },
                { text: "Fresh / Leaf", value: "fresh_or_leaf", align: "center", width: "100px", sortable: false },
                { text: "Processing Type", value: "processing_type", align: "center", width: "100px", sortable: false },
                { text: "Output Consistency", value: "output_consistency", align: "center", width: "150px", sortable: false },
                { text: "Output Name", value: "output_name", align: "center", width: "200px", sortable: false },
                { text: "Item Type", value: "item_type", align: "center", width: "150px", sortable: false },
                { text: "Final SKU / Mix", value: "final_sku_or_mix", align: "center", width: "150px", sortable: false },
                { text: "LOT #", value: "lot_num", align: "center", width: "150px", sortable: false },
                { text: "Special Directions", value: "special_directions", align: "center", width: "250px", sortable: false },
                { text: "CRC", value: "crc", align: "center", width: "75px", sortable: false },
                { text: "Actions", value: "actions", align: "center", width: "75px", sortable: false },
            ],
            rules: {
                metrcUID: (currentItem) => [
                        v => !!v && v.length === 25 || "METRC UID must be 25 characters",
                        v => !!v && !this.intake.items
                            .filter(item => currentItem !== item && !!item.metrc_uid)
                            .map(item => item.metrc_uid)
                            .includes(v) || "Duplicate METRC UID"
                ],
                metrcQty: [ v => !!v || "METRC Quantity is required" ],
                receivedQty: [ v => !!v || "Received Quantity is required" ],
                itemType: [ v => !!v || "Item Type is required" ],
                mix: [ v => !!v || "A Mix is required" ]
            },
            editedItem: {},
            editedItemIdx: -1,
            itemDialog: {
                show: false,
                action: "add"
            },
            validIntake: false,
            submitting: false,
            showSubmitPreview: false,
            snackbar: {
                show: false,
                message: ""
            },
            confirmationDialog: {
                show: false,
                title: "",
                message: "",
                okAction: () => this.confirmationDialog.show = false,
                cancelAction: () => this.confirmationDialog.show = false
            }
        }
    },

    computed: {
        ...mapState({
            intakes: state => state.intakeManager.intakes
        }),
        intakeSelections() {
            return this.intakes.map(intake => ({
                text: `${intake.client_name} / ${padID(intake.id)}`,
                value: intake
            }));
        },
        intakeItems() {
            if (this.intake) {
                return this.intake.items.map(item => {
                    item.lot_num = item.lot_num || `${this.intake.client_name.substring(0, 3).toUpperCase()}-${item.item_name.substring(0, 3).toUpperCase()}-${this.randomInt()}`;
                    if (item.item_type === "SKU")
                        item.final_sku_or_mix = "Final SKU";
                    else
                        item.final_sku_or_mix = item.final_sku_or_mix || ""
                    return item;
                });
            } else {
                return [];
            }
        },
        manifestNums() {
            return this.intake ? this.intake.manifest_num : [];
        },
        mixItems() {
            if (this.intake) {
                return this.intake.items.filter(item => item.item_type === "Mix")
                    .map((item, idx) => {
                        item.final_sku_or_mix = `Mix ${idx + 1}`;
                        return item;
                    });
            } else {
                return [];
            }
        },
        workOrderItems() {
            return this.intake ? this.intake.items.filter(item => item.item_type === "SKU" || item.item_type === "Mix") : [];
        },
        mixSelection() {
            return this.mixItems.map(item => item.final_sku_or_mix);
        },
        totalQtyGrams() {
            return this.intakeItems.filter(item => item.item_type === "SKU").reduce((total, item) => total + item.qty_grams, 0);
        },
        totalQtyLbs() {
            return this.intakeItems.filter(item => item.item_type === "SKU").reduce((total, item) => total + item.qty_lbs, 0);
        },
        metrcTotalQty() {
            return this.intakeItems.filter(item => item.item_type === "SKU" && !!item.metrc_qty_grams)
                .reduce((total, item) => total + item.metrc_qty_grams, 0);
        },
        receivedTotalQty() {
            return this.intakeItems.filter(item => item.item_type === "SKU" && !!item.received_qty_grams)
                .reduce((total, item) => total + item.received_qty_grams, 0);
        },
        enoughIngredients() {
            const availableIngredients = this.intakeItems.filter(item =>
                item.item_type === "Ingredient" && !(item.final_sku_or_mix)
            ).length;
            return availableIngredients >= 2;
        }
    },

    methods: {
        ...mapActions([ "loadIntakesForManager" ]),
        async submit() {
            try {
                this.showSubmitPreview = false;
                this.submitting = true;
                if (!this.intake.itemsToDelete)
                    this.$set(this.intake, "itemsToDelete", []);
                const result = await intakeApi.saveIntakeFromManager(this.intake);
                console.info(result);
                this.snackbar = {
                    show: true,
                    message: "Intake submitted"
                }
                await this.loadIntakesForManager();
                this.intake = null;
            } catch (error) {
                console.error("Error in submitting intake", error);
            } finally {
                this.submitting = false;
            }
        },
        async saveDraft() {
            try {
                this.savingDraft = true;
                if (!this.intake.itemsToDelete)
                    this.$set(this.intake, "itemsToDelete", []);
                const result = await intakeApi.saveIntakeDraft(this.intake);
                console.info(result);
                this.snackbar = {
                    show: true,
                    message: "Intake draft saved"
                }
                const { id: currentId } = this.intake;
                await this.loadIntakesForManager();
                this.intake = this.intakes.find(({ id }) => id === currentId);
            } catch (error) {
                console.error("Error in saving draft", error);
            } finally {
                this.savingDraft = false;
            }
        },
        addManifestNum() {
            this.manifestNums.push(this.inputManifestNum);
            this.inputManifestNum = null;
            this.showManifestDialog = false;
        },
        removeManifestNum(num) {
            const idx = this.manifestNums.indexOf(num);
            if (idx > -1) {
                this.manifestNums.splice(idx, 1);
            }
        },
        randomInt() {
            const rand = () => Math.floor(Math.random() * (9 - 0 + 1) + 0);
            return `${rand()}${rand()}${rand()}`;
        },
        calculateDiscrepancy(item) {
            item.metrc_received_discrepancy_grams = item.metrc_qty_grams - item.received_qty_grams;
            item.metrc_received_discrepancy_perc = (item.metrc_received_discrepancy_grams / item.received_qty_grams) * 100;
        },
        displayDiscrepancyPerc(discrepancy) {
            return `${discrepancy ? discrepancy.toFixed(2) : 0} %`;
        },
        addNewItem() {
            this.editedItem = {};
            this.itemDialog = {
                show: true,
                action: "add"
            };
        },
        deleteItem(item) {
            const remove = () => {
                const idx = this.intake.items.indexOf(item);
                if (idx > -1) {
                    if (item.id) {
                        if (!this.intake.itemsToDelete)
                            this.$set(this.intake, "itemsToDelete", []);
                        this.intake.itemsToDelete.push(item);
                    }
                    this.intake.items.splice(idx, 1);
                }
            }
            this.confirmationDialog = {
                show: true,
                title: "Delete Item",
                message: "Proceed?",
                okAction: remove,
                cancelAction: () => this.confirmationDialog.show = false
            }
        },
        editItem(item) {
            this.editedItemIdx = this.intakeItems.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.itemDialog = {
                show: true,
                action: "edit"
            };
        },
        saveItem() {
            if (this.itemDialog.action === "add") {
                this.intake.items.push(this.editedItem);
            } else if (this.itemDialog.action === "edit") {
                if (this.editedItemIdx > -1)
                    this.$set(this.intake.items, this.editedItemIdx, this.editedItem);
            }
            this.itemDialog = {
                show: false,
                action: "add"
            }
            this.editedItem = {};
        },
        closeItemDialog() {
            this.editedItem = {};
            this.itemDialog = {
                show: false,
                action: "add"
            };
        }
    },

    async mounted() {
        try {
            this.loadingIntakes = true;
            this.loadIntakesForManager();
            this.intakeId = this.$route.params.id;
            if (this.intakeId) {
                this.intake = this.intakes.find(intake => intake.id === this.intakeId);
                this.intakeId = padID(this.intakeId);
            }
        } catch (error) {
            console.error("Error in loading intakes", error);
        } finally {
            this.loadingIntakes = false;
        }
    }
}
</script>

<style scoped>
.item-input {
    font-size: 0.875rem;
}
.v-select__selection--disabled {
    color: black;
    font-size: 0.875rem;
}
.card-header {
    color: white;
    background-color: #C93941;
}
</style>
