<template>
    <div class="manageValues">
        <v-expansion-panels accordion focusable>
            <v-expansion-panel>
                <v-expansion-panel-header ripple>
                    <span class="h5 font-weight-medium">Output Consistency</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-container fluid class="pa-0">
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="outputConsistency"
                                    @keyup.enter="saveOutputConsistency"
                                    label="Input new item and press Enter"
                                    hide-details
                                    clearable>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-chip
                                    v-for="oc in outputConsistencies" :key="oc.id"
                                    @click:close="deleteOutputConsistency(oc)"
                                    close
                                    class="ma-2">
                                    {{ oc.name }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "ManageValues",

    data() {
        return {
            outputConsistency: null
        }
    },

    computed: {
        ...mapState({
            outputConsistencies: state => state.values.outputConsistencies
        })
    },

    methods: {
        async saveOutputConsistency() {
            try {
                console.info(`Saving output consistency: ${this.outputConsistency}`);
                await this.$store.dispatch("saveOutputConsistency", this.outputConsistency);
                this.outputConsistency = null;
            } catch (error) {
                console.error(`Error in saving output consistency '${this.outputConsistency}'`);
            }
        },
        async deleteOutputConsistency(oc) {
            try {
                console.info(`Deleting output consistency: ${oc.name}`);
                await this.$store.dispatch("deleteOutputConsistency", oc);
            } catch (error) {
                console.error(`Error in deleting output consistency '${oc.name}'`);
            }
        }
    }
}
</script>
