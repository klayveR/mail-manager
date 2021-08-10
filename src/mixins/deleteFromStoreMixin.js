import { Dialog } from "quasar";

export default {
    methods: {
        async deleteItemFromStore({ action, id, title, message }) {
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
            }).onOk(async () => {
                const result = await this.$store.dispatch(action, id);
                result.showNotification();
            });
        },
    },
};
