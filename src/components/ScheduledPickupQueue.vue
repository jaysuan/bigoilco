<template>
    <v-card elevation="2" class="scheduledPickupQueue">
        <v-expansion-panels flat accordion>
            <v-expansion-panel>
                <v-expansion-panel-header ripple>
                    <v-row align="center">
                        <v-col cols="auto" class="text-h6 secondary--text">SCHEDULED PICKUP QUEUE</v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto" class="text-right">
                            <div class="secondary--text font-weight-medium">Fresh Total Quantity</div>
                            <v-skeleton-loader v-if="gettingIntakes" type="sentences" class="ma-2" />
                            <div v-else>
                                <div class="subtitle-2 font-weight-medium ma-1">{{ freshTotalQtyInGrams.toFixed(2) }} g</div>
                                <div class="subtitle-2 font-weight-medium ma-1">({{ freshTotalQtyInLbs.toFixed(2) }} lbs )</div>
                            </div>
                        </v-col>
                        <v-col cols="auto" class="text-right">
                            <div class="secondary--text font-weight-medium">Leaf Total Quantity</div>
                            <v-skeleton-loader v-if="gettingIntakes" type="sentences" class="ma-2" />
                            <div v-else>
                                <div class="subtitle-2 font-weight-medium ma-1">{{ leafTotalQtyInGrams.toFixed(2) }} g</div>
                                <div class="subtitle-2 font-weight-medium ma-1">({{ leafTotalQtyInLbs.toFixed(2) }} lbs )</div>
                            </div>
                        </v-col>
                    </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-2">
                    <v-row>
                        <v-col cols="12">
                            <v-card
                                v-for="(intake, index) in intakes"
                                :key="intake.id"
                                elevation="3"
                                class="my-2"
                                flat>
                                <v-divider></v-divider>
                                <v-card-title class="card-header">
                                    <span class="subtitle-1">{{ padIntakeId(intake.id) }}</span>
                                    <v-spacer />
                                    <span class="subtitle-1">{{ intake.date_created }}</span>
                                </v-card-title>
                                <v-card-subtitle class="card-header white--text">{{ intake.client_name }}</v-card-subtitle>
                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="auto" class="text-left mx-2">
                                            <DatepickerDialog
                                                :value.sync="intake.actual_pickup_date"
                                                label="Actual Pickup Date" />
                                        </v-col>
                                        <v-col cols="auto" class="text-left">
                                            <div>Scheduled Pickup Date</div>
                                            <div>{{ intake.scheduled_pickup_date }}</div>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col cols="auto" class="text-right mx-2">
                                            <div>Fresh Total Quantity</div>
                                            <div>{{ intake.fresh_total_qty_grams }} g</div>
                                            <div>({{ intake.fresh_total_qty_lbs }} lbs)</div>
                                        </v-col>
                                        <v-col cols="auto" class="text-right mx-2">
                                            <div>Leaf Total Quantity</div>
                                            <div>{{ intake.leaf_total_qty_grams }} g</div>
                                            <div>({{ intake.leaf_total_qty_lbs }} lbs)</div>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn icon @click="toggleExpand(index)">
                                        <v-icon>{{ expandToggles[index] ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                                    </v-btn>
                                </v-card-actions>
                                <v-divider v-if="expandToggles[index]"></v-divider>
                                <v-expand-transition>
                                    <div v-show="expandToggles[index]">
                                        <ClientDeliveryInfo :client.sync="clients[index]" />
                                    </div>
                                </v-expand-transition>
                                <v-row v-if="intake.dispatcher_notes" no-gutters>
                                    <v-col cols="12">
                                        <v-card flat>
                                            <v-divider></v-divider>
                                            <v-card-title class="body-2 font-weight-medium">Dispatcher Notes</v-card-title>
                                            <v-card-text class="error--text body-2 font-weight-regular">{{ intake.dispatcher_notes }}</v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Submit -->
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="auto">
                            <v-btn color="primary"
                                @click.stop="submit"
                                :loading="submitting"
                                :disabled="intakesToSubmit.length < 1">
                                <v-icon left>mdi-send</v-icon>
                                Submit
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import DatepickerDialog from "@/components/DatepickerDialog";
import ClientDeliveryInfo from "@/components/ClientDeliveryInfo";
import intakeApi from "@/api/intake";
import { padID } from "@/util";

export default {
    name: "ScheduledPickupQueue",

    components: {
        DatepickerDialog,
        ClientDeliveryInfo
    },

    data() {
        return {
            gettingIntakes: false,
            expandToggles: [],
            submitting: false
        }
    },

    computed: {
        ...mapState({
            intakes: state => state.dispatch.scheduledPickupIntakes
        }),
        freshTotalQtyInGrams() {
            return this.intakes.reduce((currentSum, intake) => currentSum + intake.fresh_total_qty_grams, 0);
        },
        freshTotalQtyInLbs() {
            return this.intakes.reduce((currentSum, intake) => currentSum + intake.fresh_total_qty_lbs, 0);
        },
        leafTotalQtyInGrams() {
            return this.intakes.reduce((currentSum, intake) => currentSum + intake.leaf_total_qty_grams, 0);
        },
        leafTotalQtyInLbs() {
            return this.intakes.reduce((currentSum, intake) => currentSum + intake.leaf_total_qty_lbs, 0);
        },
        intakesToSubmit() {
            return this.intakes.filter(({ actual_pickup_date }) => !!actual_pickup_date);
        },
        clients() {
            return this.intakes.map(this.extractClient);
        }
    },

    watch: {
        intakes() {
            this.expandToggles = this.intakes.map(() => false);
        }
    },

    methods: {
        ...mapMutations(["updateScheduledPickupIntakes"]),
        ...mapActions(["setInitialScheduledPickupIntakes"]),
        async submit() {
            try {
                this.submitting = true;
                const response = await intakeApi.setActualPickupDate(this.intakesToSubmit);
                console.info(response.data);
                this.updateScheduledPickupIntakes(this.intakes.filter(intake => !this.intakesToSubmit.includes(intake)));
            } catch (error) {
                console.error("Error in setting actual pickup date");
            } finally {
                this.submitting = false;
            }
        },
        extractClient(intake) {
            return {
                id: intake.client_id,
                doing_business_as: intake.doing_business_as,
                license_num: intake.license_num,
                delivery_pickup_contact_name: intake.delivery_pickup_contact_name,
                delivery_pickup_contact_phone: intake.delivery_pickup_contact_phone,
                delivery_pickup_contact_email: intake.delivery_pickup_contact_email,
                license_address: intake.license_address,
                license_address_city: intake.license_address_city,
                license_address_state: intake.license_address_state,
                license_address_zip: intake.license_address_zip,
                delivery_pickup_constraints: intake.delivery_pickup_constraints,
                dispatch_driver_notes: intake.dispatch_driver_notes
            }
        },
        toggleExpand(index) {
            this.$set(this.expandToggles, index, !this.expandToggles[index]);
        },
        padIntakeId: padID
    },

    async mounted() {
        try {
            this.gettingIntakes = true;
            await this.setInitialScheduledPickupIntakes();
        } catch (error) {
            console.error("Error in loading intakes". error);
        } finally {
            this.gettingIntakes = false;
        }
    }
}
</script>

<style scoped>
.v-card__text,
.v-card__title,
.v-card__subtitle,
.v-card__actions {
    padding: 8px
}

.card-header {
    color: white;
    background-color: #C93941;
}
</style>
