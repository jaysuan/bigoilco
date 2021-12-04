<template>
    <v-dialog ref="dialog" v-model="showDialog" persistent :width="dialogWidth">
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="formattedDate"
                :label="label"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                clearable
            />
        </template>
        <v-date-picker v-model="selectedDate" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="showDialog = false">
                Cancel
            </v-btn>
            <v-btn text color="primary" @click="displaySelectedDate">
                OK
            </v-btn>
        </v-date-picker>
    </v-dialog>
</template>

<script>
import { format, parse } from "date-fns";

export default {
    name: "DatepickerDialog",

    props: {
        dialogWidth: {
            type: String,
            default: "290px"
        },
        label: String,
        format: {
            type: String,
            default: "MM/dd/yyyy"
        },
        value: String
    },

    data() {
        return {
            selectedDate: format(new Date(), "yyyy-MM-dd"),
            formattedDate: "",
            showDialog: false
        };
    },

    methods: {
        displaySelectedDate() {
            const date = parse(this.selectedDate, "yyyy-MM-dd", new Date());
            this.formattedDate = format(date, this.format);
            this.$emit("update:value", this.formattedDate);
            this.showDialog = false;
        }
    }
};
</script>
