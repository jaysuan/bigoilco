<template>
    <v-btn
        :loading="isLoading"
        :disabled="isLoading"
        large
        dark
        @click="handleClick"
        >{{ btnText }}
        <template v-slot:loader>
            <span>Loading...</span>
        </template>
    </v-btn>
</template>

<script>
export default {
    props: {
        clickFunction: {
            type: Function,
            default: () => {}
        },
        btnText: {
            type: String,
            default: "Save"
        }
    },
    data() {
        return {
            isLoading: false,
            loader: null
        };
    },
    watch: {
        // loader() {
        //     const l = this.loader;
        //     this[l] = !this[l];
        //     setTimeout(() => (this[l] = false), 3000);
        //     this.loader = null;
        // }
    },

    methods: {
        handleClick() {
            this.loader = "isLoading";
            this.clickFunction();
        }
    }
};
</script>

<style></style>
