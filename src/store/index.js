import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import SecureLS from "secure-ls";
import simpleBrowserFingerprint from "simple-browser-fingerprint";

import accounts from "@/store/modules/accounts";
import hosts from "@/store/modules/hosts";
import reports from "@/store/modules/reports";

const ls = new SecureLS({
    encodingType: "AES",
    encryptionSecret: simpleBrowserFingerprint(),
    isCompression: true,
});

const vuexLocal = new VuexPersistence({
    key: "vuex",
    saveState: (key, state) => ls.set(key, state),
    restoreState: (key) => ls.get(key),
});

export default createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: { accounts, hosts, reports },
    plugins: [vuexLocal.plugin],
});
