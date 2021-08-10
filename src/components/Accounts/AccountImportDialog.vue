<template>
    <q-dialog v-model="visible" persistent transition-show="jump-down" transition-hide="jump-down">
        <q-card>
            <q-card-section class="row items-center q-pb-none">
                <div>
                    <span class="text-h6">E-Mail Konten importieren</span>
                </div>
                <q-space />
                <q-btn icon="close" flat round dense @click="onCloseButtonClicked()" />
            </q-card-section>

            <q-form ref="form" @submit="submit">
                <q-card-section class="q-gutter-sm">
                    <template v-if="csvData == null">
                        <q-file
                            v-model="form.file"
                            accept=".csv"
                            label="CSV-Datei auswählen..."
                            :rules="[(val) => val != null || 'Dieses Feld ist erforderlich.']"
                            :disable="csvData != null"
                        >
                            <template v-slot:prepend>
                                <q-icon name="attach_file" />
                            </template>
                        </q-file>

                        <q-input
                            bottom-slots
                            v-model="form.delimiter"
                            label="Trennzeichen"
                            maxlength="1"
                            :rules="[(val) => (val && val.length === 1) || 'Dieses Feld ist erforderlich.']"
                            hint="Zeichen, mit dem Spalten getrennt werden (z.B. Komma oder Semikolon)"
                        />
                    </template>
                    <template v-if="csvData != null">
                        <q-select
                            v-model="form.userHeader"
                            :options="csvData.headers"
                            label="Feld E-Mail Adresse"
                            :rules="[
                                (val) => (val && val.length > 0) || 'Dieses Feld ist erforderlich.',
                                (val) => val !== form.passwordHeader || 'Das Feld darf nicht gleich dem Feld Passwort sein',
                            ]"
                        >
                            <template v-slot:prepend>
                                <q-icon name="mail" />
                            </template>
                        </q-select>

                        <q-select
                            v-model="form.passwordHeader"
                            :options="csvData.headers"
                            label="Feld Password"
                            :rules="[
                                (val) => (val && val.length > 0) || 'Dieses Feld ist erforderlich.',
                                (val) => val !== form.userHeader || 'Das Feld darf nicht gleich dem Feld E-Mail Adresse sein',
                            ]"
                        >
                            <template v-slot:prepend>
                                <q-icon name="lock" />
                            </template>
                        </q-select>

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
                                                size="sm"
                                            />
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>

                        <q-item tag="label" v-ripple class="q-mt-sm">
                            <q-item-section avatar>
                                <q-checkbox v-model="form.updateExisting" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>Existierende Konten aktualisieren</q-item-label>
                                <q-item-label caption>
                                    Wenn diese Option aktiviert ist, werden Passwort und Posteingangsserver in bereits
                                    hinzugefügten E-Mail Konten aktualisiert.
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat :label="csvData == null ? 'Weiter' : 'Importieren'" type="submit" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { Dialog, Notify } from "quasar";
import { v4 as uuidv4 } from "uuid";

import BooleanIcon from "@/apponents/BooleanIcon.vue";

let removeListener;
const formDefaults = {
    file: undefined,
    delimiter: ",",
    host: undefined,
    userHeader: undefined,
    passwordHeader: undefined,
    updateExisting: false,
};

export default defineComponent({
    name: "Account Import Dialog",

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
        open() {
            this.visible = true;
            removeListener = window.ipc.on("PARSE_CSV", this.onCsvDataReceived);
        },

        close() {
            this.visible = false;

            if (removeListener) {
                removeListener();
            }

            this.resetComponent();
        },

        resetComponent() {
            this.csvData = undefined;
            this.transactionId = undefined;
            this.canClose = true;
            this.form = { ...formDefaults };
            this.$refs.form.resetValidation();
        },

        onCloseButtonClicked() {
            if (this.canClose) {
                this.close();
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
                this.close();
            });
        },

        onCsvDataReceived(payload) {
            if (payload.transactionId !== this.transactionId) {
                return;
            }

            if (!payload.success) {
                Notify.create({
                    message: "Fehler beim Parsen der CSV-Datei",
                    caption: payload.message,
                    icon: "error",
                    type: "negative",
                });

                return;
            }

            this.csvData = payload.data;
            this.canClose = false;
        },

        submit() {
            if (this.csvData == null) {
                this.submitFile();
            } else {
                this.submitImport();
            }
        },

        submitFile() {
            this.transactionId = uuidv4();
            window.ipc.send("PARSE_CSV", {
                transactionId: this.transactionId,
                filePath: this.form.file.path,
                delimiter: this.form.delimiter,
            });
        },

        async submitImport() {
            const items = [];
            for (const row of this.csvData.rows) {
                items.push({
                    user: row[this.form.userHeader],
                    password: row[this.form.passwordHeader],
                    host: this.form.host,
                });
            }

            const result = await this.$store.dispatch("accounts/import", {
                items: items,
                updateExisting: this.form.updateExisting,
            });
            result.showNotification();

            if (result.success) {
                this.canClose = true;
                this.close();
            }
        },
    },

    data() {
        return {
            visible: false,
            csvData: undefined,
            transactionId: undefined,
            canClose: true,
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
