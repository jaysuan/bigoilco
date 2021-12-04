<template>
    <v-container fluid>
        <v-col cols="12">
            <v-card v-bind="$attrs" class="v-card--material pa-3">
                <v-text-field
                    class="my-8"
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>

                <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="clients"
                    item-key="licensed_business_name"
                    :items-per-page="5"
                    :search="search"
                    show-select
                >
                    <template v-slot:item.sales_rep_id="{ item }">
                        <v-avatar>
                            <img
                                :src="getSalesRepImage(item.sales_rep_id)"
                                alt="Sales Rep Image"
                            />
                        </v-avatar>
                    </template>
                    <template v-slot:item.status>
                        <v-chip class="my-8" color="red" dark>
                            Active
                        </v-chip>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-icon class="mr-2" @click="editClient(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon @click="deleteClient(item)">
                            mdi-delete
                        </v-icon>
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
        </v-col>

        <v-btn
            class="mt-4 float-right"
            fab
            x-large
            elevation="4"
            dark
            color="blue"
            @click="editClient(null)"
        >
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="headline"
                    >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="blue darken-1"
                        dark
                        large
                        outlined
                        @click="toggleDeleteModal"
                        >Cancel</v-btn
                    >
                    <v-btn large @click="confirmDeleteClient">Confirm</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <client-modal
            v-if="showEditModal"
            :client="currentClientSelected"
            :close-edit-modal="closeEditModal"
            :post-action="fetchClients"
        ></client-modal>
    </v-container>
</template>

<script>
import ClientModal from "@/components/forms/ClientModal.vue";
import clientApi from "@/api/client";

export default {
    name: "Admin",

    components: {
        ClientModal
    },

    data() {
        return {
            search: "",

            activeTab: null,
            selected: [],
            headers: [
                {
                    text: "Email Address",
                    value: "email"
                },
                {
                    text: "License Business Name",
                    value: "licensed_business_name"
                },
                { text: "Sales Rep", value: "sales_rep_id", sortable: true },
                { text: "Date Created", value: "date_created", sortable: true },
                { text: "Status", value: "status", sortable: true },
                { text: "Action", value: "actions", sortable: false }
            ],
            clients: [],
            currentClientSelected: {},
            dialogDelete: false,
            showEditModal: false
        };
    },

    computed: {
        getAllUsers() {
            return this.$store.state.values.salesReps;
        }
    },

    async mounted() {
        this.fetchClients();
        await this.$store.dispatch("loadValuesOfType", "sales_rep");
    },

    methods: {
        toggleDeleteModal() {
            this.dialogDelete = !this.dialogDelete;
        },

        deleteClient(item) {
            this.currentClientSelected = item;

            console.log(Object.assign({}, item));
            this.toggleDeleteModal();
        },

        async confirmDeleteClient() {
            const newClients = this.clients.filter(
                item => item !== this.currentClientSelected
            );
            this.clients = newClients;

            this.toggleDeleteModal();
        },

        toggleEditModal() {
            this.showEditModal = !this.showEditModal;
        },

        closeEditModal() {
            this.showEditModal = false;
        },

        editClient(item) {
            this.toggleEditModal();
            this.currentClientSelected = item;
        },

        getSalesRepImage(salesRepId) {
            const getUser = this.getSalesRep(salesRepId);

            if (getUser) {
                const userImage = getUser.image;
                const getImage =
                    userImage && userImage !== "" ? userImage : "cat.jpeg";
                return require(`@/assets/users/${getImage}`);
            }
        },

        getSalesRep(id) {
            return this.getAllUsers.find(user => user.id === id);
        },

        async fetchClients() {
            const clientResponse = await clientApi.getAllClients();
            this.clients = clientResponse.data;
        }
    }
};
</script>

<style scoped>
.v-tab:not(.v-tab--active) {
    color: blue;
}
</style>
