import adminApi from "@/api/admin";

export default {
    state: () => ({
        auditLogs: []
    }),

    mutations: {
        setAuditLogs(state, payload) {
            state.auditLogs = payload;
        }
    },

    actions: {
        async loadAuditLogs({ commit }) {
            const response = await adminApi.getAuditLogs();
            console.log("AUDITS ARE", response);
            commit("setAuditLogs", response.data);
        }
    }
};
