<template>
    <q-table
        :columns="columns"
        :pagination="pagination"
        :visible-columns="visibleColumns"
        :rows-per-page-options="[0]"
        :rows="data"
        no-data-label="Keine Postfächer vorhanden"
        row-key="name"
        hide-bottom
        dense
    >
        <template v-slot:body-cell-deleted="props">
            <q-td :props="props">
                <span :class="props.value > 0 ? 'text-negative' : ''">{{ props.value }}</span>
            </q-td>
        </template>
    </q-table>
</template>

<script>
import { defineComponent } from "vue";

const columns = [
    { name: "name", label: "Postfach", field: "name", align: "left", required: true, sortable: true },
    { name: "path", label: "Interner Pfad", field: "path", align: "left", required: true },
    { name: "messages", label: "E-Mails", field: "messages", required: true },
    { name: "unseen", label: "Ungelesen", field: "unseen" },
    { name: "recent", label: "Vor kurzem erhalten", field: "recent" },
    { name: "deleted", label: "Gelöscht", field: "deleted" },
];

const pagination = {
    sortBy: "name",
    ascending: true,
};

export default defineComponent({
    name: "Mailbox Table",

    props: {
        data: Array,
    },

    computed: {
        visibleColumns() {
            if (this.data.length === 0) {
                return [];
            }

            const possibleColumns = ["unseen", "recent", "deleted"];
            const visibleColumns = [];

            for (const column of possibleColumns) {
                if (column in this.data[0]) {
                    visibleColumns.push(column);
                }
            }

            return visibleColumns;
        },
    },

    data() {
        return {
            columns,
            pagination,
        };
    },
});
</script>

<style scoped>
.q-card {
    width: 100%;
}
</style>
