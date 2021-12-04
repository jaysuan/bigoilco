import valuesApi from "@/api/values";

export default {
    state: () => ({
        salesReps: [],
        outputConsistencies: []
    }),

    mutations: {
        updateSalesReps(state, salesReps) {
            state.salesReps = salesReps;
        },
        updateOutputConsistencies(state, outputConsistencies) {
            state.outputConsistencies = outputConsistencies;
        },
        addToOutputConsistencies(state, outputConsistency) {
            state.outputConsistencies.push(outputConsistency);
        }
    },

    actions: {
        async saveOutputConsistency({ commit }, name) {
            const response = await valuesApi.save("output_consistency", {
                name
            });
            const { id } = response.data;
            commit("addToOutputConsistencies", { id, name });
        },

        async deleteOutputConsistency({ state, commit }, { id }) {
            await valuesApi.deleteById("output_consistency", id);
            const updatedOutputConsistencies = state.outputConsistencies.filter(
                oc => oc.id !== id
            );
            commit("updateOutputConsistencies", updatedOutputConsistencies);
        },

        async loadValues({ commit }) {
            const response = await valuesApi.getByBatch([
                "sales_rep",
                "output_consistency"
            ]);
            commit("updateSalesReps", response.data["sales_rep"]);
            commit(
                "updateOutputConsistencies",
                response.data["output_consistency"]
            );
        },

        async loadValuesOfType({ commit }, payload) {
            const response = await valuesApi.getAll(payload);
            switch (payload) {
                case "output_consistency":
                    commit(
                        "updateOutputConsistencies",
                        response.data["output_consistency"]
                    );
                    break;
                case "sales_rep":
                    commit("updateSalesReps", response.data);
                    break;
                default:
                    throw "Invalid value type";
            }
        }
    }
};
