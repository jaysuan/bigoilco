import intakeApi from "@/api/intake";

export default {
    state: () => ({
        intakes: []
    }),

    mutations: {
        updateIntakes(state, payload) {
            state.intakes = payload;
        }
    },

    actions: {
        async loadIntakesForManager({ commit }) {
            const response = await intakeApi.getIntakesForManager();
            commit("updateIntakes", response.data);
        }
    }
}
