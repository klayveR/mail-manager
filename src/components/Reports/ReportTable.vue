<template>
    <q-table
        :rows="rows"
        :columns="columns"
        :pagination="pagination"
        row-key="id"
        no-data-label="Keine Berichte vorhanden"
        :rows-per-page-options="[25, 50, 100, 0]"
        rows-per-page-label="Berichte pro Seite:"
    >
        <template v-slot:body="props">
            <q-tr
                :props="props"
                :class="`cursor-pointer ${props.row.read ? 'text-grey-5 bg-grey-1' : ''}`"
                @click="routeToReport(props.row.id)"
            >
                <q-td key="success" :props="props" style="width: 30px">
                    <BooleanIcon :enabled="props.row.success" icon-true="done" icon-false="error" size="sm" />
                </q-td>
                <q-td key="name" :props="props">
                    {{ props.row.name }}
                </q-td>
                <q-td key="user" :props="props">
                    <span v-if="props.row.data.account != null">
                        {{ props.row.data.account.user }}
                    </span>
                </q-td>
                <q-td key="date" :props="props">
                    {{ getDateString(props.row.date) }}<br />
                    <small class="text-grey"> {{ getTimeString(props.row.date) }} Uhr </small>
                </q-td>
                <q-td key="actions" :props="props">
                    <q-btn icon="delete" dense round flat color="negative" @click.stop="deleteReport(props.row)">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"> Entfernen </q-tooltip>
                    </q-btn>
                </q-td>
            </q-tr>
        </template>
    </q-table>
</template>

<script>
import { defineComponent } from "vue";
import moment from "moment";

import BooleanIcon from "@/apponents/BooleanIcon.vue";

import deleteFromStoreMixin from "@/mixins/deleteFromStoreMixin";
import dateMixin from "@/mixins/dateMixin";

const columns = [
    { name: "success", field: "success", align: "center" },
    { name: "name", label: "Bericht", align: "left", field: "name", sortable: true },
    { name: "user", label: "E-Mail Konto", align: "left", field: "data" },
    {
        name: "date",
        label: "Datum",
        field: "date",
        align: "left",
        sortable: true,
        sort: (a, b) => moment(a).valueOf() - moment(b).valueOf(),
    },
    { name: "actions", field: "id" },
];

const pagination = {
    sortBy: "date",
    descending: true,
};

export default defineComponent({
    name: "Report Table",

    mixins: [deleteFromStoreMixin, dateMixin],

    components: {
        BooleanIcon,
    },

    props: {
        rows: Array,
    },

    data() {
        return {
            columns,
            pagination,
        };
    },

    methods: {
        deleteReport(row) {
            this.deleteItemFromStore({
                action: "reports/delete",
                id: row.id,
                title: "Bericht löschen",
                message: `Möchten Sie den Bericht wirklich löschen?`,
            });
        },
        routeToReport(id) {
            this.$router.push({ name: `report`, params: { id: id } });
        },
    },
});
</script>
