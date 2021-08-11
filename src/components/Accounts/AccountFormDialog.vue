<template>
    <q-dialog v-model="visible" persistent transition-show="jump-down" transition-hide="jump-down">
        <q-card>
            <q-card-section class="row items-center q-pb-none">
                <div>
                    <span class="text-h6">E-Mail Konto {{ editMode ? "bearbeiten" : "hinzufügen" }}</span>
                </div>
                <q-space />
                <q-btn icon="close" flat round dense @click="close()" />
            </q-card-section>

            <q-form ref="form" @submit="submit" @reset="resetForm">
                <q-card-section class="q-gutter-sm">
                    <q-input
                        v-model="form.user"
                        label="E-Mail Adresse"
                        :rules="[(val) => (val && val.length > 0) || 'Dieses Feld ist erforderlich.']"
                        :readonly="editMode"
                        @update:model-value="changed = true"
                    >
                        <template v-slot:prepend>
                            <q-icon name="mail" />
                        </template>
                    </q-input>

                    <q-input
                        v-model="form.password"
                        label="Passwort"
                        :rules="[(val) => (val && val.length > 0) || 'Dieses Feld ist erforderlich.']"
                        :type="passwordHidden ? 'password' : 'text'"
                        @update:model-value="changed = true"
                    >
                        <template v-slot:prepend>
                            <q-icon name="lock" />
                        </template>
                        <template v-slot:append>
                            <q-icon
                                :name="passwordHidden ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="passwordHidden = !passwordHidden"
                            />
                        </template>
                    </q-input>

                    <q-select
                        v-model="form.host"
                        :options="hostOptions"
                        label="Posteingangsserver"
                        :rules="[(val) => (val && val.length > 0) || 'Dieses Feld ist erforderlich.']"
                        emit-value
                        map-options
                        @update:model-value="changed = true"
                    >
                        <template v-slot:prepend>
                            <q-icon name="storage" />
                        </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section>
                                    <q-item-label v-html="scope.opt.label" />
                                    <q-item-label caption>
                                        Port {{ scope.opt.port }}
                                        <BooleanIcon
                                            :enabled="scope.opt.secure"
                                            icon-true="lock"
                                            icon-false="no_encryption"
                                            size="xs"
                                        />
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
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

import BooleanIcon from "@/apponents/BooleanIcon.vue";

const formDefaults = {
    user: undefined,
    password: undefined,
    host: undefined,
};

export default defineComponent({
    name: "Account Form Dialog",

    components: {
        BooleanIcon,
    },

    props: {
        hosts: Object,
    },

    computed: {
        hostOptions() {
            const options = [];
            for (const [id, host] of Object.entries(this.hosts)) {
                options.push({
                    label: host.server,
                    value: id,
                    port: host.port,
                    secure: host.secure,
                });
            }

            return options;
        },
    },

    methods: {
        openInEditMode(data) {
            this.editMode = true;
            this.form = { ...data };
            this.subtitle = data.user;
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
            this.passwordHidden = true;
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

                result = await this.$store.dispatch("accounts/update", { id: this.form.id, item });
            } else {
                result = await this.$store.dispatch("accounts/add", this.form);
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
            passwordHidden: true,
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
