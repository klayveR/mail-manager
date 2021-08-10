import { v4 as uuidv4 } from "uuid";
import ActionResult from "@/classes/ActionResult";

export default {
    namespaced: true,
    state: {
        items: {},
    },
    getters: {
        getAsArray(state) {
            return Object.entries(state.items).map((e) => ({
                id: e[0],
                ...e[1],
            }));
        },
        getById(state) {
            return (id) => {
                if (id in state.items) {
                    return { ...state.items[id] };
                }

                return;
            };
        },
        getId(state, getters) {
            return (item) => {
                const found = getters.getAsArray.find((el) => el.user === item.user);
                if (found != null) {
                    return found.id;
                }

                return;
            };
        },
        exists(state, getters) {
            return ({ id, item }) => {
                const duplicate = getters.getAsArray.find((el) => el.id !== id && el.user === item.user);
                return duplicate != null;
            };
        },
        existsId(state) {
            return (id) => {
                return id in state.items;
            };
        },
    },
    mutations: {
        setItem(state, { id, item }) {
            state.items[id] = { ...item };
        },
        deleteItem(state, id) {
            delete state.items[id];
        },
    },
    actions: {
        add({ commit, getters }, item) {
            if (getters.exists({ item })) {
                return ActionResult.error(false, `Ein E-Mail Konto mit der E-Mail Adresse ${item.user} existiert bereits.`);
            }

            const id = uuidv4();
            commit("setItem", { id, item });
            return ActionResult.success(`E-Mail Konto wurde erfolgreich hinzugefügt.`);
        },
        update({ getters, commit }, { id, item }) {
            if (!getters.existsId(id)) {
                return ActionResult.error("Zu bearbeitendes E-Mail Konto konnte nicht gefunden werden.");
            }

            if (getters.exists({ id, item })) {
                return ActionResult.error(`Ein E-Mail Konto mit der E-Mail Adresse ${item.user} existiert bereits.`);
            }

            commit("setItem", { id, item });
            return ActionResult.success(`E-Mail Konto wurde erfolgreich gespeichert.`);
        },
        delete({ getters, commit }, id) {
            if (!getters.existsId(id)) {
                return ActionResult.error("Das zu löschende E-Mail Konto konnte nicht gefunden werden.");
            }

            commit("deleteItem", id);
            return ActionResult.success("E-Mail Konto wurde erfolgreich gelöscht.");
        },
        import({ getters, dispatch }, { items = [], updateExisting = false }) {
            let updated = 0;
            let added = 0;

            for (let item of items) {
                if (item.user == null || item.user == "" || item.password == null || item.password == "") {
                    continue;
                }

                if (getters.exists({ item })) {
                    if (!updateExisting) {
                        continue;
                    }

                    const existingId = getters.getId(item);
                    dispatch("update", { id: existingId, item });
                    updated += 1;
                } else {
                    dispatch("add", item);
                    added += 1;
                }
            }

            return ActionResult.success("E-Mail Konten wurden erfolgreich importiert.", {
                caption: `${added} Konten hinzugefügt, ${updated} aktualisiert`,
            });
        },
    },
};
