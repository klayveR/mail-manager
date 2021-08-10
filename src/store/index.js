import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

import accounts from "@/store/modules/accounts";
import hosts from "@/store/modules/hosts";
import reports from "@/store/modules/reports";

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
});

export default createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: { accounts, hosts, reports },
    plugins: [vuexLocal.plugin],
});
