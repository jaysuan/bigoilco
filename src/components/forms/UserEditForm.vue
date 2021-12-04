<template>
    <v-dialog
        v-model="showDialog"
        @click:outside="closeUserModal"
        max-width="600px"
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="closeUserModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>User Details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items> </v-toolbar-items>
            </v-toolbar>
            <v-container fluid>
                <v-form class="mt-4" ref="form">
                    <v-row>
                        <v-col cols="6">
                            <v-text-field
                                v-model="currentUser.displayName"
                                label="Full Name"
                                outlined
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="currentUser.email"
                                label="Email"
                                outlined
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-select
                                v-model="currentUser.customClaims.role"
                                :items="roles"
                                label="User Role"
                                outlined
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    dark
                    large
                    outlined
                    @click="closeUserModal"
                    >Close</v-btn
                >

                <v-btn
                    class="my-4"
                    dark
                    large
                    color="blue darken-1"
                    @click="handleSubmit"
                    >Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import userApi from "@/api/user";

export default {
    props: {
        showDialog: {
            default: true,
            type: Boolean
        },
        toggleModal: {
            default: () => {},
            type: Function
        }
    },

    data() {
        return {
            roles: ["Admin", "Salesman", "Employee", "Processor", "Viewer"],
            userDetail: null
        };
    },

    computed: {
        isUserExist() {
            return this.user.uid;
        },
        currentUser() {
            return (
                this.$store.state.user.currentUser || {
                    displayName: "",
                    email: "",
                    customClaims: {
                        role: ""
                    }
                }
            );
        }
    },

    mounted() {},

    methods: {
        ...mapActions(["closeUserModal"]),

        handleSubmit() {
            const payload = {
                uid: this.currentUser.uid,
                role: this.currentUser.customClaims.role
            };
            if (this.currentUser && this.currentUser.uid) {
                this.patchUser(payload);
            }
        },

        async patchUser(payload) {
            let response;
            const { uid } = payload;
            try {
                response = await userApi.updateUser(uid, payload);
            } catch (error) {
                console.error(error);
            } finally {
                this.closeUserModal();
            }

            return response;
        }
    }
};
</script>

<style></style>
