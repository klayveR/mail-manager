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
        getLinkedAccounts(state, getters, rootState, rootGetters) {
            return (id) => {
                const accounts = rootGetters["accounts/getAsArray"];
                return accounts.filter((account) => account.host === id);
            };
        },
        getById(state) {
            return (id) => {
                if (id in state.items) {
                    return { ...state.items[id] };
                }

                return undefined;
            };
        },
        exists(state, getters) {
            return ({ id, item }) => {
                const duplicate = getters.getAsArray.find(
                    (el) => el.id !== id && el.server === item.server && el.port === item.port && el.secure === item.secure
                );
                return duplicate != null;
            };
        },
        existsId(state) {
            return (id) => {
                return id in state.items;
            };
        },
        count(state) {
            return Object.keys(state.items).length;
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
            const id = uuidv4();
            if (getters.exists({ id, item })) {
                return ActionResult.error("Ein identischer Posteingangsserver existiert bereits.");
            }

            commit("setItem", { id, item });
            return ActionResult.success(`Posteingangsserver wurde erfolgreich hinzugefügt.`);
        },
        update({ getters, commit }, { id, item }) {
            if (!getters.existsId(id)) {
                return ActionResult.error("Der zu bearbeitende Posteingangsserver konnte nicht gefunden werden.");
            }

            if (getters.exists({ id, item })) {
                return ActionResult.error("Ein identischer Posteingangsserver existiert bereits.");
            }

            commit("setItem", { id, item });
            return ActionResult.success(`Posteingangsserver wurde erfolgreich gespeichert.`);
        },
        delete({ getters, commit }, id) {
            if (!getters.existsId(id)) {
                return ActionResult.error("Zu löschender Posteingangsserver konnte nicht gefunden werden.");
            }

            if (getters.getLinkedAccounts(id).length > 0) {
                return ActionResult.error("Der Posteingangsserver kann nicht gelöscht werden.", {
                    caption: `Es sind E-Mail Konten mit diesem Posteingangsserver verbunden.`,
                });
            }

            commit("deleteItem", id);
            return ActionResult.success("Posteingangsserver wurde erfolgreich gelöscht.");
        },
    },
};
