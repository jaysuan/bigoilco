import userApi from "@/api/user";

export default {
    state: () => ({
        users: [],
        currentUser: null
    }),

    mutations: {
        setUsers(state, payload) {
            state.users = payload;
        },

        setCurrentUser(state, user) {
            state.currentUser = user;
        }
    },

    actions: {
        async loadUsers({ commit }) {
            const response = await userApi.getUsers();
            commit("setUsers", response.data);
        }
    }
};
