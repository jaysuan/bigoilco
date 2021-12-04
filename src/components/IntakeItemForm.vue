<template>
    <v-card>
        <v-card-title class="card-header">{{ title }}</v-card-title>
        <v-card-text>
            <v-form v-model="validIntakeItem" ref="intakeItemForm">
                <v-container>
                    <v-row v-if="itemTypeSelection">
                        <v-col cols="12" class="pl-0">
                            <v-radio-group
                                v-model="value.item_type"
                                label="Item Type"
                                mandatory
                                row
                                class="pa-0">
                                <template v-slot:label>
                                    <span class="body-1 font-weight-regular mr-2">Item Type:</span>
                                </template>
                                <v-radio
                                    label="Mix"
                                    value="Mix"
                                />
                                <v-radio
                                    label="Ingredient"
                                    value="Ingredient"
                                />
                                <v-radio
                                    label="SKU"
                                    value="SKU"
                                />
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row class="mt-0">
                        <v-text-field
                            v-model.trim="value.item_name"
                            :rules="rules.itemName"
                            label="Item Name"/>
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model.number="value.qty_grams"
                            :rules="rules.qtyInGrams"
                            label="Quantity (g)"/>
                    </v-row>
                    <v-row>
                        <v-select
                            v-model="value.fresh_or_leaf"
                            :items="['Fresh', 'Leaf']"
                            :rules="rules.freshOrLeaf"
                            label="Fresh / Leaf"/>
                    </v-row>
                    <v-row>
                        <v-select
                            v-model="value.processing_type"
                            :items="['BHO', 'Solventless']"
                            :rules="rules.processingType"
                            label="Processing Type"/>
                    </v-row>
                    <v-row>
                        <v-select
                            v-model="value.output_consistency"
                            :items="outputConsistencies"
                            item-text="name"
                            item-value="name"
                            :loading="loadingValues"
                            :rules="rules.outputConsistency"
                            label="Output Consistency"/>
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model.trim="value.output_name"
                            label="Output Name" />
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model.trim="value.special_directions"
                            label="Special Directions" />
                    </v-row>
                        <v-row>
                        <v-select
                            v-model="value.crc"
                            :items="['None', 'Regular', 'Light', 'Heavy']"
                            :rules="rules.crc"
                            label="CRC" />
                    </v-row>
                </v-container>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                @click.stop="ok"
                :disabled="!validIntakeItem"
                text>
                OK
            </v-btn>
            <v-btn
                @click.stop="cancel"
                text>
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "IntakeItemForm",

    props: {
        value: {
            type: Object,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        itemTypeSelection: {
            type: Boolean,
            required: false
        }
    },

    data() {
        return {
            loadingValues: false,
            validIntakeItem: false,
            rules: {
                itemName: [ v => !!v && v.length > 0 || "Item Name is required" ],
                qtyInGrams: [ v => /^\d+(\.\d{1,2})?$/.test(v) || "Invalid quantity" ],
                freshOrLeaf: [ v => !!v || "Fresh / Leaf is required" ],
                processingType: [ v => !!v || "Processing Type is required" ],
                outputConsistency: [ v => !!v || "Output Consistency is required" ],
                crc: [ v => !!v || "CRC is required" ],
            }
        }
    },

    computed: {
        ...mapState({
            outputConsistencies: state => state.values.outputConsistencies
        }),
        isEditingMix: {
            get() {
                return this.value.item_type === "Mix";
            },
            set(val) {
                this.value.item_type = val ? "Mix" : "";
            }
        }
    },

    methods: {
        ...mapActions([ "loadValues" ]),
        ok() {
            this.value.qty_lbs = this.value.qty_grams * 0.00220462;
            this.$emit("input", {
                ...this.value
            });
            this.$emit("click:ok");
            this.$refs.intakeItemForm.reset();
        },
        cancel() {
            if (this.value)
                this.$emit("input", this.value);
            this.$refs.intakeItemForm.reset();
            this.$emit("click:cancel");
        }
    },

    async mounted() {
        try {
            this.loadingValues = true;
            await this.loadValues();
        } catch (error) {
            console.error("Error in loading values: ", error);
        } finally {
            this.loadingValues = false;
        }
    }
}
</script>

<style scoped>
.card-header {
    color: white;
    background-color: #C93941;
}
</style>
