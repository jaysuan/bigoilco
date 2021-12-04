<template>
    <v-card flat class="clientDeliveryInfo">
        <v-card-title>
            <div class="subtitle-1 font-weight-regular">Origin DBA: <span class="subtitle-1 font-weight-regular">{{ client.doing_business_as }}</span></div>
            <v-spacer></v-spacer>
            <v-btn
                v-if="isEditing && isClientModified"
                @click.stop="updateClient"
                :loading="clientUpdating"
                icon>
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn
                @click="isEditing = !isEditing"
                icon>
                <v-icon>{{ isEditing ? "mdi-pencil-off" : "mdi-pencil" }}</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-subtitle>
            <v-container fluid class="pa-0 ma-0">
                <v-row no-gutters align="center">
                    <v-col cols="auto" class="text-left caption font-weight-light">
                        License #: <span class="caption font-weight-regular">{{ client.license_num }}</span>
                    </v-col>
                </v-row>
                <v-row no-gutters align="center" class="ma-0">
                    <v-col cols="auto" class="text-left caption font-weight-light">
                        License Address: <span class="caption font-weight-regular">{{ address }}</span>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-subtitle>
        <v-card-text>
            <v-form ref="deliveryContactForm">
                <v-container fluid>
                    <v-row justify="start">
                        <v-col cols="6" class="pa-0">
                            <v-container fluid>
                                <v-row dense>Delivery Point of Contact</v-row>
                                <v-row dense>
                                    <v-col>
                                        <v-text-field
                                            prepend-icon="mdi-account"
                                            v-model.trim="editedClient.delivery_pickup_contact_name"
                                            :disabled="!isEditing"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col>
                                        <v-text-field
                                            prepend-icon="mdi-phone"
                                            v-model.trim="editedClient.delivery_pickup_contact_phone"
                                            :disabled="!isEditing"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col>
                                        <v-text-field
                                            prepend-icon="mdi-email"
                                            v-model.trim="editedClient.delivery_pickup_contact_email"
                                            :disabled="!isEditing"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>
                        <v-col cols="6" class="pa-0">
                            <v-container fluid>
                                <v-row>
                                    <v-textarea
                                        v-model="editedClient.delivery_pickup_constraints"
                                        label="Delivery Constraints"
                                        :disabled="!isEditing"
                                        height=""
                                        outlined
                                        no-resize
                                    />
                                </v-row>
                                <v-row>
                                    <v-textarea
                                        v-model="editedClient.dispatch_driver_notes"
                                        label="Dispatch / Driver Notes"
                                        :disabled="!isEditing"
                                        outlined
                                        no-resize
                                    />
                                </v-row>
                            </v-container>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import clientApi from "@/api/client";

export default {
    name: "ClientDeliveryInfo",
    
    props: [ "client" ],

    data() {
        return {
            editedClient: Object.assign({}, this.client),
            isEditing: false,
            isClientModified: false,
            clientUpdating: false,
        }
    },

    watch: {
        "editedClient.delivery_pickup_contact_name": function (val) {
            this.setClientModified("delivery_pickup_contact_name", val); 
        },
        "editedClient.delivery_pickup_contact_phone": function (val) {
            this.setClientModified("delivery_pickup_contact_phone", val); 
        },
        "editedClient.delivery_pickup_contact_email": function (val) {
            this.setClientModified("delivery_pickup_contact_email", val); 
        },
        "editedClient.delivery_pickup_constraints": function (val) {
            this.setClientModified("delivery_pickup_constraints", val); 
        },
        "editedClient.dispatch_driver_notes": function (val) {
            this.setClientModified("dispatch_driver_notes", val);
        }
    },

    computed: {
        address() {
            const {
                license_address: street,
                license_address_city: city,
                license_address_state: state,
                license_address_zip: zip
            } = this.client;
            return `${street} ${city}, ${state} ${zip}`;
        }
    },

    methods: {
        async updateClient() {
            const { id } = this.client;
            try {
                this.clientUpdating = true;
                const response = await clientApi.updateClient(id,
                    {
                        delivery_pickup_contact_name: this.editedClient.delivery_pickup_contact_name,
                        delivery_pickup_contact_phone: this.editedClient.delivery_pickup_contact_phone,
                        delivery_pickup_contact_email: this.editedClient.delivery_pickup_contact_email,
                        delivery_pickup_constraints: this.editedClient.delivery_pickup_constraints,
                        dispatch_driver_notes: this.editedClient.dispatch_driver_notes,
                    }
                );
                console.info("Updated client delivery info: ", response.data);
                this.$emit("update:client", this.editedClient);
                this.isEditing = false;
            } catch (error) {
                console.error("Error updating client delivery info: ", error);
            } finally {
                this.clientUpdating = false;
            }
        },
        setClientModified(prop, newVal) {
            if (newVal) {
                this.isClientModified = this.client[prop] !== newVal;
            } else {
                if (this.client[prop]) {
                    this.isClientModified = true;
                } else {
                    this.isClientModified = false;
                }
            }
        }
    }
}
</script>

<style scoped>
.v-card__actions,
.v-card__subtitle,
.v-card__text,
.v-card__title {
    padding: 8px
}
</style>
