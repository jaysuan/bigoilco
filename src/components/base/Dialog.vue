<template>
    <v-dialog v-model="showDialog" max-width="450">
        <v-alert
            border="left"
            colored-border
            :type="dialogType"
            elevation="2"
            prominent
            tiled
        >
            <v-card-title> {{ title }}</v-card-title>

            <v-card-text>
                {{ message }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" text @click="clearDialog">
                    {{ cancelText }}
                </v-btn>

                <v-btn color="green darken-1" text @click="handleSubmit">
                    {{ submitText }}
                </v-btn>
            </v-card-actions>
        </v-alert>
    </v-dialog>
</template>

<script>
export default {
    props: {},

    data() {
        return {
            showDialog: false,
            dialogType: "",
            title: "Logout User",
            message: "Are you sure you want to Logout?",
            submitFunction: null,
            cancelText: "Cancel",
            submitText: "Submit"
        };
    },

    mounted() {
        this.$root.$on("openDialog", content => {
            this.openDialog();
            this.setDialogContent(content);
        });

        this.$root.$on("closeDialog", () => {
            this.clearDialog();
        });
    },

    methods: {
        setDialogContent(content) {
            const { title, message, type, submitFunction } = content;
            this.title = title;
            this.message = message;
            this.submitFunction = submitFunction;
            this.dialogType = type;

            if (type === "info" || type === "success" || type === "error") {
                this.submitText = "OK";
            } else if (type === "warning") {
                this.submitText = "OK";
                this.cancelText = "Cancel";
            }
        },

        async handleSubmit() {
            this.submitFunction();
            this.clearDialog();
        },

        openDialog() {
            this.showDialog = true;
        },
        closeDialog() {
            this.showDialog = false;
        },

        clearDialog() {
            this.closeDialog();
            this.message = "";
            this.dialogType = "info";
            this.submitFunction = null;
        }
    }
};
</script>

<style></style>
