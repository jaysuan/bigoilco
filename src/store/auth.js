import { auth } from "../firebase";

export default {
    state: () => ({
        currentUser: null
    }),

    mutations: {
        setCurrentUser(state, payload) {
            state.currentUser = payload;
        }
    },

    getters: {
        currentUser: state => state.currentUser
    },

    actions: {
        async handleUserlogout({ commit }) {
            console.log("logout");
            await auth.signOut();
            commit("setCurrentUser", null);
        }
    }
};
