<template>
    <v-dialog
        v-model="showDialog"
        @click:outside="closeEditModal"
        transition="dialog-bottom-transition"
        max-width="1500"
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="closeEditModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Client Onboarding Details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items> </v-toolbar-items>
            </v-toolbar>
            <v-container fluid>
                <client-form
                    :client="client"
                    :close-function="closeEditModal"
                ></client-form>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import ClientForm from "@/components/forms/ClientForm";

export default {
    components: {
        ClientForm
    },
    props: {
        client: {
            default: () => {
                return {};
            },
            type: Object
        },
        showDialog: {
            default: true,
            type: Boolean
        },
        closeEditModal: {
            default: () => {},
            type: Function
        },
        postAction: {
            default: () => {},
            type: Function
        }
    },

    mounted() {
        this.$root.$on("postRequest", () => {
            this.postAction();
            this.closeEditModal();
        });
    }
};
</script>

<style></style>
