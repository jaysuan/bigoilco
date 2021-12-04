import Vue from "vue";
import Vuex from "vuex";
import dispatch from "./dispatch";
import intakeManager from "./intakeManager";
import values from "./values";
import user from "./user";
import auth from "./auth";
import utils from "./utils";
import admin from "./admin";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        dispatch,
        intakeManager,
        values,
        user,
        auth,
        utils,
        admin
    }
});
