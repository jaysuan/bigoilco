<template>
    <v-container>
        <v-card>
            <v-toolbar dark color="blue">
                <v-toolbar-title>Public Client Onboarding</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items> </v-toolbar-items>
            </v-toolbar>
            <v-container fluid>
                <client-form :client="null"></client-form>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import ClientForm from "@/components/forms/ClientForm.vue";

export default {
    components: {
        ClientForm
    }
};
</script>

<style></style>
