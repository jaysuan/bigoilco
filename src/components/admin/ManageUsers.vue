<template>
    <v-card>
        <v-data-table
            :items="users"
            :headers="headers"
            :loading="loadingUsers"
            loading-text="Loading Users"
            @click:row="handleShowEditForm"
        >
        </v-data-table>
        <user-edit-form v-if="showUserModal"></user-edit-form>
    </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UserEditForm from "@/components/forms/UserEditForm.vue";

export default {
    components: {
        UserEditForm
    },
    name: "ManageUsers",

    data() {
        return {
            headers: [
                { text: "ID", value: "uid" },
                { text: "Display Name", value: "displayName" },
                { text: "Email", value: "email" },
                { text: "Role", value: "customClaims.role" }
            ],
            loadingUsers: false,
            showForm: false,
            currentUser: null
        };
    },

    computed: {
        ...mapState({
            users: state => state.user.users,
            showUserModal: state => state.utils.showUserModal
        })
    },

    methods: {
        ...mapActions(["loadUsers", "openUserModal", "closeUserModal"]),

        handleShowEditForm(item) {
            this.$store.commit("setCurrentUser", item);
            this.openUserModal();
        }
    },

    async mounted() {
        try {
            this.loadingUsers = true;
            await this.loadUsers();
        } catch (error) {
            console.error("Error in loading users: ", error);
        } finally {
            this.loadingUsers = false;
        }
    }
};
</script>
