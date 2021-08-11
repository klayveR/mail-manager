import { Dialog } from "quasar";

export default {
    methods: {
        async deleteItemsFromStore({ action, ids, title, message }, callback = function () {}) {
            Dialog.create({
                title,
                message,
                persistent: true,
                cancel: {
                    label: "Abbrechen",
                    flat: true,
                },
                ok: {
                    label: "Löschen",
                    flat: true,
                },
            })
                .onOk(async () => {
                    if (!Array.isArray(ids)) {
                        console.error("Can not delete items from store, ids is not an array");
                        return;
                    }

                    const deletedIds = [];
                    for (const id of ids) {
                        const result = await this.$store.dispatch(action, id);
                        result.showNotification();

                        if (result.success) {
                            deletedIds.push(id);
                        }
                    }

                    callback(deletedIds);
                })
                .onCancel(() => {
                    callback([]);
                });
        },
    },
};
