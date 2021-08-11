<template>
    <q-table
        row-key="id"
        no-data-label="Keine E-Mail Konten vorhanden"
        rows-per-page-label="E-Mail Konten pro Seite:"
        :rows="rows"
        :columns="columns"
        :filter="filter"
        :rows-per-page-options="[10, 25, 50]"
    >
        <template v-slot:top>
            <q-btn color="positive" icon="add" label="Hinzufügen" class="q-mr-sm" @click="openAddFormDialog()" />
            <q-btn color="primary" icon="grid_on" label="CSV">
                <q-menu auto-close>
                    <q-list style="min-width: 100px">
                        <q-item clickable @click="openImportDialog()">
                            <q-item-section>Importieren...</q-item-section>
                        </q-item>
                        <q-item clickable @click="exportToCSV(rows, ['user', 'password'], 'email-export.csv')">
                            <q-item-section>Exportieren</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>

            <q-space />

            <q-input dense debounce="300" color="primary" v-model="filter">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
        <template v-slot:body-cell-host="props">
            <q-td :props="props">
                <template v-if="hosts[props.value] != null">
                    {{ hosts[props.value].server }}<br />
                    <small class="text-grey">
                        Port {{ hosts[props.value].port }}
                        <BooleanIcon :enabled="hosts[props.value].secure" icon-true="lock" icon-false="no_encryption" size="xs" />
                    </small>
                </template>
                <template v-else>
                    <span class="text-negative">Posteingangsserver nicht gefunden</span>
                </template>
            </q-td>
        </template>
        <template v-slot:body-cell-password="props">
            <q-td :props="props">
                <BlurredText>{{ props.value }}</BlurredText>
            </q-td>
        </template>
        <template v-slot:body-cell-tasks="props">
            <q-td :props="props">
                <TestConnectionButton :account="props.row" :host="hosts[props.row.host]" />
                <GetInformationButton :account="props.row" :host="hosts[props.row.host]" />
                <DeleteEmailsButton :account="props.row" :host="hosts[props.row.host]" />
            </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <q-btn icon="edit" dense round flat color="primary" @click="$refs.formDialog.openInEditMode(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"> Bearbeiten</q-tooltip>
                </q-btn>
                <q-btn icon="delete" dense round flat color="negative" @click="deleteAccount(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"> Entfernen </q-tooltip>
                </q-btn>
            </q-td>
        </template>
    </q-table>

    <AccountFormDialog ref="formDialog" :hosts="hosts" />
    <AccountImportDialog ref="importDialog" :hosts="hosts" />
</template>

<script>
import { defineComponent } from "vue";
import { Dialog } from "quasar";

import deleteFromStoreMixin from "@/mixins/deleteFromStoreMixin";
import exportToCSVMixin from "@/mixins/exportToCSVMixin";

import BlurredText from "@/apponents/BlurredText.vue";
import BooleanIcon from "@/apponents/BooleanIcon.vue";

import AccountFormDialog from "@/components/Accounts/AccountFormDialog.vue";
import AccountImportDialog from "@/components/Accounts/AccountImportDialog.vue";
import TestConnectionButton from "@/components/Accounts/Buttons/TestConnectionButton.vue";
import GetInformationButton from "@/components/Accounts/Buttons/GetInformationButton.vue";
import DeleteEmailsButton from "@/components/Accounts/Buttons/DeleteEmailsButton.vue";
import { mapGetters } from "vuex";

const columns = [
    { name: "user", label: "E-Mail Adresse", align: "left", field: "user", sortable: true },
    { name: "password", label: "Passwort", field: "password", align: "left" },
    { name: "host", label: "Posteingangsserver", field: "host", align: "left", sortable: true },
    { name: "tasks", label: "Aktionen", field: "id" },
    { name: "actions", field: "id" },
];

export default defineComponent({
    name: "Account Table",

    mixins: [deleteFromStoreMixin, exportToCSVMixin],

    components: {
        BooleanIcon,
        BlurredText,
        AccountFormDialog,
        AccountImportDialog,
        GetInformationButton,
        TestConnectionButton,
        DeleteEmailsButton,
    },

    props: {
        rows: Array,
        hosts: Object,
    },

    computed: {
        ...mapGetters("hosts", {
            hostCount: "count",
        }),
    },

    methods: {
        deleteAccount(row) {
            this.deleteItemsFromStore({
                action: "accounts/delete",
                ids: [row.id],
                title: "E-Mail Konto löschen",
                message: `Möchten Sie das E-Mail Konto ${row.user} wirklich löschen?`,
            });
        },
        openImportDialog() {
            if (this.hostCount === 0) {
                this.showNoHostNotification();
            } else {
                this.$refs.importDialog.open();
            }
        },
        openAddFormDialog() {
            if (this.hostCount === 0) {
                this.showNoHostNotification();
            } else {
                this.$refs.formDialog.open();
            }
        },
        showNoHostNotification() {
            Dialog.create({
                title: "Kein Posteingangsserver vorhanden",
                message:
                    "Damit E-Mail Konten hinzugefügt oder importiert werden können, muss mindestens ein Posteingangsserver existieren.",
                ok: "Posteingangsserver verwalten",
                cancel: "Abbrechen",
            }).onOk(() => {
                this.$router.push({ name: `hosts` });
            });
        },
    },

    data() {
        return {
            columns,
            filter: "",
        };
    },
});
</script>
