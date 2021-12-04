<template>
    <v-card>
        <v-data-table
            :items="salesReps"
            :headers="headers"
            :loading="loadingSalesReps"
            loading-text="Loading Sales Reps">
        </v-data-table>
    </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "ManageSalesReps",

    data() {
        return {
            headers: [
                { text: "ID", value: "id" },
                { text: "First Name", value: "first_name" },
                { text: "Last Name", value: "last_name" },
                { text: "Email", value: "email" },
            ],
            loadingSalesReps: false
        }
    },

    computed: {
        ...mapState({
            salesReps: state => state.values.salesReps
        })
    },

    methods: {
        ...mapActions(["loadValues"])
    },

    async mounted() {
        try {
            this.loadingSalesReps = true;
            await this.loadValues();
        } catch (error) {
            console.error("Error in loading values");
        } finally {
            this.loadingSalesReps = false;
        }
    }
}
</script>
