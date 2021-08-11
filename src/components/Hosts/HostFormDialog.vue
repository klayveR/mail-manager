<template>
    <q-dialog v-model="visible" persistent>
        <q-card>
            <q-card-section class="row items-center q-pb-none">
                <div>
                    <span class="text-h6">Posteingangsserver {{ editMode ? "bearbeiten" : "hinzufügen" }}</span>
                    <span v-if="editMode" class="text-subtitle3"><br />{{ subtitle }}</span>
                </div>
                <q-space />
                <q-btn icon="close" flat round dense @click="close()" />
            </q-card-section>

            <q-form ref="form" @submit="submit" @reset="resetForm">
                <q-card-section class="q-gutter-sm">
                    <q-input
                        v-model="form.server"
                        label="Posteingangsserver"
                        :rules="[(val) => (val && val.length > 0) || 'Dieses Feld ist erforderlich.']"
                        hint="z.B. imap.gmail.com"
                        @update:model-value="changed = true"
                    >
                        <template v-slot:prepend>
                            <q-icon name="storage" />
                        </template>
                    </q-input>

                    <q-input
                        v-model.number="form.port"
                        label="Port"
                        :rules="[(val) => (val && !isNaN(val)) || 'Dieses Feld ist erforderlich.']"
                        type="number"
                        hint="Standardmäßig 143 oder 993 (nur mit TLS)"
                        @update:model-value="changed = true"
                    >
                        <template v-slot:prepend>
                            <q-icon name="settings_ethernet" />
                        </template>
                    </q-input>

                    <q-item tag="label" v-ripple class="q-mt-sm">
                        <q-item-section avatar>
                            <q-checkbox v-model="form.secure" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>TLS</q-item-label>
                            <q-item-label caption> Wenn diese Option aktiviert ist, wird die Verbindung gesichert. </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn v-if="!editMode" flat label="Reset" type="reset" color="grey" />
                    <q-btn flat :label="editMode ? 'Bearbeiten' : 'Hinzufügen'" type="submit" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { Dialog } from "quasar";

const formDefaults = {
    server: undefined,
    port: undefined,
    secure: false,
};

export default defineComponent({
    name: "Host Form Dialog",

    props: {
        hosts: Object,
    },

    methods: {
        openInEditMode(data) {
            this.editMode = true;
            this.form = { ...data };
            this.subtitle = data.server;
            this.open();
        },

        open() {
            this.visible = true;
        },

        async close() {
            if (!this.changed) {
                this.resetComponent();
                this.visible = false;
                return;
            }

            Dialog.create({
                title: "Änderungen verwerfen?",
                message: "Wenn Sie dieses Fenster schließen, gehen alle Änderungen verloren. Fortfahren?",
                persistent: true,
                cancel: {
                    label: "Abbrechen",
                    flat: true,
                },
                ok: {
                    label: "Verwerfen",
                    flat: true,
                },
            }).onOk(async () => {
                this.resetComponent();
                this.visible = false;
            });
        },

        resetComponent() {
            this.resetForm();
            this.editMode = false;
            this.subtitle = undefined;
            this.changed = false;
        },

        resetForm() {
            this.form = { ...formDefaults };
            this.$refs.form.resetValidation();
        },

        async submit() {
            let result;
            if (this.editMode) {
                const item = { ...this.form };
                delete item.id;

                result = await this.$store.dispatch("hosts/update", { id: this.form.id, item });
            } else {
                result = await this.$store.dispatch("hosts/add", this.form);
            }
            result.showNotification();

            if (result.success) {
                this.changed = false;
                this.close();
            }
        },
    },

    data() {
        return {
            visible: false,
            changed: false,
            editMode: false,
            subtitle: undefined,
            form: { ...formDefaults },
        };
    },
});
</script>

<style scoped>
form {
    min-width: 500px;
}
</style>
