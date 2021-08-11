<template>
    <q-table
        :rows="rows"
        :columns="columns"
        :filter="filter"
        row-key="id"
        no-data-label="Keine Posteingangsserver vorhanden"
        :rows-per-page-options="[25, 50, 100, 0]"
        rows-per-page-label="Posteingangsserver pro Seite:"
    >
        <template v-slot:top>
            <q-btn color="positive" icon="add" label="Hinzufügen" class="q-mr-sm" @click="$refs.formDialog.open()" />
            <q-space />
            <q-input dense debounce="300" color="primary" v-model="filter">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
        <template v-slot:body-cell-secure="props">
            <q-td :props="props">
                <BooleanIcon :enabled="props.value" icon-true="lock" icon-false="no_encryption" size="sm" />
            </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <q-btn icon="edit" dense round flat color="primary" @click="$refs.formDialog.openInEditMode(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"> Bearbeiten </q-tooltip>
                </q-btn>
                <q-btn icon="delete" dense round flat color="negative" @click="deleteHost(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"> Entfernen </q-tooltip>
                </q-btn>
            </q-td>
        </template>
    </q-table>

    <HostFormDialog ref="formDialog" />
</template>

<script>
import { defineComponent } from "vue";
import deleteFromStoreMixin from "@/mixins/deleteFromStoreMixin";
import HostFormDialog from "@/components/Hosts/HostFormDialog.vue";
import BooleanIcon from "@/apponents/BooleanIcon.vue";

const columns = [
    { name: "server", label: "Posteingangsserver", align: "left", field: "server", sortable: true },
    { name: "port", label: "Port", field: "port", align: "left" },
    { name: "secure", label: "TLS", field: "secure", align: "left" },
    { name: "actions", field: "id" },
];

export default defineComponent({
    name: "Host Table",

    components: {
        HostFormDialog,
        BooleanIcon,
    },

    mixins: [deleteFromStoreMixin],

    props: {
        rows: Array,
    },

    data() {
        return {
            columns,
            filter: "",
        };
    },

    methods: {
        deleteHost(row) {
            this.deleteItemsFromStore({
                action: "hosts/delete",
                ids: [row.id],
                title: "Posteingangsserver löschen",
                message: `Möchten Sie den Posteingangsserver ${row.server} wirklich löschen?`,
            });
        },
    },
});
</script>
