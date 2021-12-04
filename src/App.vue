<template>
    <div class="main-app">
        <router-view />
        <base-dialog></base-dialog>
        <base-snackbar-alert></base-snackbar-alert>
    </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

.v-main {
    background-color: #646464;
}

.v-application,
.main-app {
    font-family: "Poppins", sans-serif !important;
}
</style>
