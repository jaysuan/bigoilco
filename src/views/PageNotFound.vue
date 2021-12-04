<template>
    <v-app>
        <v-main>
            <v-container fluid fill-height justify-center align="center">
                <v-card
                    class="d-flex flex-column justify-center align-center"
                    width="100vw"
                    height="100vh"
                >
                    <h1 class="error-title error--text">404</h1>
                    <h1>You don't have access to this page!</h1>
                    <h2>
                        If you're not sure what you're looking for, go back to
                        Home
                    </h2>
                    <v-btn class="my-4" @click="goBackToHome">
                        GO TO HOME</v-btn
                    >
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    methods: {
        goBackToHome() {
            this.$router.push("/");
        }
    }
};
</script>

<style></style>
