import intakeApi from "@/api/intake"; 

export default {
    state: () => ({
        pickupIntakes: [],
        scheduledPickupIntakes: []
    }),

    mutations: {
        updatePickupIntakes(state, payload) {
            state.pickupIntakes = payload;
        },
        updateScheduledPickupIntakes(state, payload) {
            state.scheduledPickupIntakes = payload;
        },
        addToScheduledPickupIntakes(state, payload) {
            state.scheduledPickupIntakes = state.scheduledPickupIntakes.concat(payload);
        }
    },
    
    actions: {
        async setInitialPickupIntakes({ commit }) {
            const response = await intakeApi.getIntakesToDispatch();
            const intakes = response.data;
            commit("updatePickupIntakes", intakes);
        },
        async setInitialScheduledPickupIntakes({ commit }) {
            const response = await intakeApi.getIntakesScheduledPickup();
            const intakes = response.data;
            commit("updateScheduledPickupIntakes", intakes);
        }
    }
}