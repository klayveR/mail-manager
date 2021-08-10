import { v4 as uuidv4 } from "uuid";
import moment from "moment";
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

                return undefined;
            };
        },
        existsId(state) {
            return (id) => {
                return id in state.items;
            };
        },
        unreadCount(state, getters) {
            return getters.getAsArray.filter((item) => item.read === false).length;
        },
    },
    mutations: {
        setItem(state, { id, item }) {
            state.items[id] = { ...item };
        },
        deleteItem(state, id) {
            delete state.items[id];
        },
        markAsRead(state, id) {
            state.items[id].read = true;
        },
    },
    actions: {
        add({ commit }, { payload, channel, name }) {
            const id = uuidv4();

            const item = {
                ...payload,
                channel: channel,
                date: moment().toISOString(),
                name: name,
                read: false,
            };

            commit("setItem", { id, item });
            return ActionResult.success("Bericht wurde erfolgreich hinzugefügt.", {}, { id });
        },
        delete({ getters, commit }, id) {
            if (!getters.existsId(id)) {
                return ActionResult.error("Zu löschender Bericht konnte nicht gefunden werden.");
            }

            commit("deleteItem", id);
            return ActionResult.success("Bericht wurde erfolgreich gelöscht.");
        },
        markAsRead({ getters, commit }, id) {
            if (!getters.existsId(id)) {
                return ActionResult.error("Der Bericht, der als gelesen markiert werden soll, konnte nicht gefunden werden.");
            }

            commit("markAsRead", id);
            return ActionResult.success("Bericht wurde erfolgreich als gelesen markiert.");
        },
    },
};
