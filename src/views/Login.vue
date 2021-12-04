<template>
    <v-app>
        <v-main>
            <v-container fluid fill-height justify-center align="center">
                <v-card
                    class="card elevation-12"
                    max-width="1000"
                    min-height="670"
                >
                    <v-row no-gutters class="row-wrapper">
                        <v-col
                            class="column-left-container"
                            lg="6"
                            md="6"
                            sm="6"
                            xs="6"
                        >
                            <v-img
                                class="header-image"
                                src="@/assets/logo.png"
                            ></v-img>
                            <p class="hello font-weight-bold">
                                Hello, <br />
                                Welcome!
                            </p>

                            <v-form id="login"> </v-form>
                        </v-col>

                        <v-col
                            class="column-right-container"
                            lg="6"
                            md="6"
                            sm="6"
                            xs="6"
                        >
                        </v-col>
                    </v-row>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { auth } from "../firebase";

export default {
    name: "Login",

    async mounted() {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const ui =
            firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(auth);
        ui.start("#login", {
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    signInMethod:
                        firebase.auth.EmailAuthProvider
                            .EMAIL_LINK_SIGN_IN_METHOD,
                    scopes: [
                        "https://www.googleapis.com/auth/contacts.readonly"
                    ],
                    customParameters: {
                        hd: "bigoilco.com",
                        prompt: "select_account"
                    }
                }
            ],
            callbacks: {
                signInSuccessWithAuthResult: authResult => {
                    console.info(`Google Sign In successful`);
                    console.info(
                        "Is new user: ",
                        authResult.additionalUserInfo.isNewUser
                    );

                    this.$root.$emit("showSnackbar", {
                        show: true,
                        message: `You have successfully logged in.`
                    });
                    return true;
                }
            },
            signInSuccessUrl: "/"
        });
    }
};
</script>
<style scoped lang="scss">
.card {
    width: 1000px;
    // box-shadow: 5px 5px 5px rgb(146, 43, 43) !important;
    border-right: 5px solid rgb(146, 43, 43) !important;
    border-bottom: 5px solid rgb(146, 43, 43) !important;
    .row-wrapper {
        .column-left-container {
            padding: 80px;
            .header-form-text {
                text-align: center;
                font-size: 80px;
                font-weight: bold;
                margin-top: 20px;
                margin-bottom: 0;
            }
            .hello {
                margin-top: 20px;
                margin-bottom: 0;
                font-size: 40px;
                color: rgb(146, 43, 43);
            }
            .welcome {
                margin-bottom: 0;
                margin-top: -12px;
                font-size: 40px;
                color: rgb(146, 43, 43);
            }
            .username-input {
                margin-top: 20px;
            }
            .password-input {
                margin-top: -20px;
            }
            .v-input--selection-controls.v-input {
                flex: 0 1 auto;
                margin: 0;
            }
            .flex-wrapper {
                display: flex;
                width: 100%;
                margin-top: -20px;
                .checkbox {
                    top: -20 !important;
                }
                label {
                    font-size: 12px;
                    opacity: 0.5;
                    width: 50%;
                    position: relative;
                }
                .forget-password-link {
                    margin: 0;
                    font-size: 12px;
                    opacity: 0.5;
                    width: 50%;
                    position: relative;
                    bottom: 2px;
                    left: 3px;
                    text-align: right;
                    text-decoration: none;
                }
            }
            .button-flex-wrapper {
                margin-top: 30px;
                #btn-login {
                    font-size: 13px !important;
                    width: 35%;
                    padding: 0 !important;
                }
                #btn-signup {
                    border: 1px solid rgb(146, 43, 43) !important;
                    font-size: 13px !important;
                    width: 35%;
                }
                .login-button {
                    background-color: rgb(146, 43, 43);
                    color: #fafafa;
                }
                .signup-button {
                    margin-left: 30px;
                }
            }
        }
        .column-right-container {
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url("../assets/BigOilLandingPage.png");
            height: 670px;
            max-height: 670px;
        }
    }

    //large pc
    @media (max-width: 1200px) {
        width: 800px;

        .row-wrapper {
            .column-left-container {
                .header-form-text {
                    font-size: 70px;
                }
                .hello {
                    font-size: 30px;
                }
                .welcome {
                    font-size: 30px;
                }
                .flex-wrapper {
                    label {
                        font-size: 12px;
                    }
                    .forget-password-link {
                        font-size: 12px;
                    }
                }
                .button-flex-wrapper {
                    #btn-login {
                        font-size: 13px !important;
                    }
                    #btn-signup {
                        font-size: 13px !important;
                    }
                }
            }
        }
    }
    //small pc
    @media (max-width: 991) {
    }
    //for tab
    @media (max-width: 768px) {
        width: 450px;
        .row-wrapper {
            .column-left-container {
                padding: 10px;
                .header-form-text {
                    font-size: 60px;
                }
                .hello {
                    font-size: 25px;
                }
                .welcome {
                    font-size: 25px;
                }
                .flex-wrapper {
                    label {
                        font-size: 12px;
                    }
                    .forget-password-link {
                        font-size: 12px;
                    }
                }
                .button-flex-wrapper {
                    #btn-login {
                        font-size: 13px !important;
                    }
                    #btn-signup {
                        font-size: 13px !important;
                    }
                }
            }
        }
    }
    //for mobile
    @media (max-width: 600px) {
        margin-top: 100px;
        width: 350px;
        .row-wrapper {
            .column-left-container {
                padding: 15px;
                .header-image {
                    width: 150px;
                }
                .header-form-text {
                    font-size: 30px;
                }
                .hello {
                    margin-top: 5px;
                    font-size: 20px;
                }
                .welcome {
                    font-size: 20px;
                }
                .flex-wrapper {
                    .checkbox {
                        position: relative;
                        top: -50px !important;
                    }
                    label {
                        font-size: 9px;
                    }
                    .forget-password-link {
                        font-size: 9px;
                        margin-top: 4px;
                    }
                }
                .button-flex-wrapper {
                    margin-top: 20px;
                    #btn-login {
                        font-size: 10px !important;
                        height: 30px;
                    }
                    #btn-signup {
                        font-size: 10px !important;
                        height: 30px;
                    }
                }
            }
        }
    }
}
</style>
