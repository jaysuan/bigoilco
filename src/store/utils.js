export default {
    state: () => ({
        showUserModal: false
    }),

    mutations: {
        toggleUserModal(state, value) {
            state.showUserModal = value;
        }
    },

    actions: {
        openUserModal({ commit }) {
            commit("toggleUserModal", true);
        },

        closeUserModal({ commit }) {
            commit("toggleUserModal", false);
        }
    }
};
