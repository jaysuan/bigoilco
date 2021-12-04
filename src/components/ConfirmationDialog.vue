<template>
    <v-dialog
        v-model="value"
        :width="width"
        persistent>
        <v-card>
            <v-card-title class="card-header">
                {{ title }}
            </v-card-title>
            <v-card-text class="py-2">{{ message }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    @click.stop="ok"
                    text>
                    OK
                </v-btn>
                <v-btn
                    @click.stop="cancel"
                    text>
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "ConfirmationDialog",

    props: {
        value: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String
        },
        width: {
            type: Number,
            default: 500
        }
    },

    methods: {
        ok() {
            this.$emit("input", false);
            this.$emit("click:ok");
        },
        cancel() {
            this.$emit("input", false);
            this.$emit("click:cancel");
        }
    }
}
</script>

<style scoped>
.card-header {
    color: white;
    background-color: #C93941;
}
</style>
