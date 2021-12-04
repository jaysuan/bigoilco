<template>
    <v-card>
        <v-card v-bind="$attrs" class="v-card--material pa-3">
            <v-text-field
                class="my-4"
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>

            <v-data-table
                :headers="headers"
                :items="getAuditLogs"
                item-key="name"
                :loading="loadingLogs"
                :items-per-page="20"
                :search="search"
            >
                <template v-slot:item.name="{ item }">
                    <v-chip class="my-4" color="grey" dark>
                        {{ item.name }}
                    </v-chip>
                </template>

                <template v-slot:no-data>
                    <v-alert :value="true" color="error" icon="warning">
                        THIS IS EMPTY
                    </v-alert>
                </template>

                <template v-slot:no-results>
                    <v-alert :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>
    </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "AuditLog",

    data() {
        return {
            headers: [
                { text: "Name", value: "name", sortable: true, width: "10%" },
                {
                    text: "User Email",
                    value: "email"
                },
                {
                    text: "Action",
                    value: "action"
                },
                {
                    text: "Timestamp",
                    value: "date_created",
                    sortable: true
                }
            ],

            search: null,
            loadingLogs: false
        };
    },

    computed: {
        getAuditLogs() {
            return this.$store.state.admin.auditLogs;
        }
    },

    async mounted() {
        try {
            this.loadingLogs = true;
            await this.loadAuditLogs();
        } catch (error) {
            console.error("Error in loading Audit Logs: ", error);
        } finally {
            this.loadingLogs = false;
        }
    },

    methods: {
        ...mapActions(["loadAuditLogs"])
    }
};
</script>
