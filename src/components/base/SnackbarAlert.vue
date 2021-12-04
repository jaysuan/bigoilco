<template>
    <v-snackbar
        v-model="value.show"
        timeout="4000"
        color="secondary"
        bottom
        app
        :multi-line="true"
    >
        {{ value.message }}
        <template v-slot:action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click.stop="close">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
export default {
    name: "SnackbarAlert",

    props: {
        value: {
            default: () => {
                return {
                    show: false,
                    message: ""
                };
            },
            type: Object
        }
    },

    mounted() {
        this.$root.$on("showSnackbar", content => {
            this.value = content;
        });
    },
    methods: {
        close() {
            this.value = {
                show: false,
                message: ""
            };
        }
    }
};
</script>
