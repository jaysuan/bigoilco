<template>
    <v-container class="admin">
        <v-card>
            <v-tabs
                v-model="activeTab"
                background-color="secondary"
                slider-color="white"
                dark
            >
                <v-tab>Sales Reps</v-tab>
                <v-tab>Values</v-tab>
                <v-tab>Users</v-tab>
                <v-tab>Audit Log</v-tab>
            </v-tabs>
            <v-tabs-items v-model="activeTab">
                <v-tab-item>
                    <ManageSalesReps />
                </v-tab-item>
                <v-tab-item>
                    <ManageValues />
                </v-tab-item>
                <v-tab-item>
                    <ManageUsers />
                </v-tab-item>
                <v-tab-item>
                    <AuditLog />
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-container>
</template>

<script>
import ManageSalesReps from "@/components/admin/ManageSalesReps.vue";
import ManageValues from "@/components/admin/ManageValues.vue";
import ManageUsers from "@/components/admin/ManageUsers.vue";
import AuditLog from "@/components/admin/AuditLog.vue";

export default {
    name: "Admin",

    components: {
        ManageSalesReps,
        ManageValues,
        ManageUsers,
        AuditLog
    },

    data() {
        return {
            activeTab: null
        };
    }
};
</script>

<style scoped>
.v-tab:not(.v-tab--active) {
    color: blue;
}
</style>
