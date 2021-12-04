<template>
    <v-app>
        <v-app-bar app color="white" clipped-left>
            <v-app-bar-nav-icon
                v-if="!isPagePublic"
                @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <v-toolbar-title @click.stop="redirectToHome">
                <v-img :src="logo" height="25px" width="143px" contain></v-img>
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" app temporary clipped>
            <v-list nav dense>
                <v-list-item-group v-model="group">
                    <v-list-item tag="router-link" to="/">
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>
                    <template v-for="nav in navItems">
                        <v-list-item
                            :key="`navigation-${nav.title}`"
                            tag="router-link"
                            :to="nav.link"
                            v-if="isPermitted(nav.role)"
                        >
                            <v-list-item-title>{{
                                nav.title
                            }}</v-list-item-title>
                        </v-list-item>
                    </template>

                    <v-divider></v-divider>
                    <v-list-item @click="handleLogout">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <v-divider></v-divider>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import logo from "@/assets/logo.png";

export default {
    name: "App",

    data: () => ({
        drawer: false,
        group: null,
        logo,
        navItems: [
            {
                title: "Client Onboarding",
                link: "/clients",
                role: "Salesman"
            },
            {
                title: "New Intake",
                link: "/intake",
                role: "Salesman"
            },
            {
                title: "Dispatcher",
                link: "/dispatch",
                role: "Employee"
            },
            {
                title: "Intake Manager",
                link: "/intake-manager",
                role: "Employee"
            },
            {
                title: "Work Orders",
                link: "/work-orders",
                role: "Employee"
            },
            {
                title: "Admin",
                link: "/admin",
                role: "Admin"
            }
        ]
    }),

    computed: {
        ...mapGetters(["currentUser"]),
        isLoggedIn() {
            return !!this.currentUser;
        },
        isPagePublic() {
            return this.$route.path.includes("/public");
        }
    },

    watch: {
        group() {
            this.drawer = false;
        }
    },

    methods: {
        ...mapActions(["handleUserlogout"]),
        redirectToHome() {
            if (!this.isPagePublic) {
                this.$router.push("/");
            }
        },
        isPermitted(role) {
            return (
                this.isLoggedIn &&
                (this.currentUser.role === role ||
                    this.currentUser.role === "Admin")
            );
        },

        handleLogout() {
            this.$root.$emit("openDialog", {
                title: "Logout Current Session",
                message: "Are you sure you want to Logout?",
                type: "warning",
                submitFunction: () => {
                    this.handleUserlogout();
                    this.$root.$emit("showSnackbar", {
                        show: true,
                        message: `You have been successfully logged out.`
                    });
                    this.$router.push("/login");
                }
            });
        }
    }
};
</script>

<style>
.v-main {
    background-color: #646464;
}

.v-application {
    font-family: "Poppins", sans-serif !important;
}
</style>
