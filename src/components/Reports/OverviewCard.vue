<template>
    <q-card>
        <q-card-section>
            <div class="row">
                <div class="col q-mr-sm text-h6">
                    {{ report.name }}
                </div>
                <div class="col">
                    <q-btn
                        flat
                        dense
                        class="float-right"
                        icon="delete"
                        color="negative"
                        label="Bericht löschen"
                        @click="deleteReport()"
                    />
                </div>
            </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
            <div class="row">
                <div class="col q-mr-sm">
                    <div class="text-weight-medium">Ergebnis</div>
                    <div :class="report.success ? 'text-positive' : 'text-negative'">
                        {{ report.message }}
                    </div>
                </div>
                <div class="col">
                    <div class="text-weight-medium">Datum</div>
                    <div class="text-grey-7">{{ getDateString(report.date) }}, {{ getTimeString(report.date) }} Uhr</div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="text-weight-medium">Transaktions-ID</div>
                    <div class="text-grey-7">{{ report.transactionId }}</div>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
import { defineComponent } from "vue";

import deleteFromStoreMixin from "@/mixins/deleteFromStoreMixin";
import dateMixin from "@/mixins/dateMixin";

export default defineComponent({
    name: "Overview Card",

    mixins: [deleteFromStoreMixin, dateMixin],

    props: {
        report: Object,
        reportId: String,
    },

    methods: {
        deleteReport() {
            // Delete report from store and return to reports list if deletion successful
            this.deleteItemsFromStore(
                {
                    action: "reports/delete",
                    ids: [this.reportId],
                    title: "Bericht löschen",
                    message: `Möchten Sie diesen Bericht wirklich löschen?`,
                },
                (deletedIds) => {
                    if (deletedIds.length >= 1) {
                        this.$router.push({ name: "reports" });
                    }
                }
            );
        },
    },
});
</script>

<style scoped>
.q-card {
    width: 100%;
}
</style>
