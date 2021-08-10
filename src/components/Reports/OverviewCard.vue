<template>
    <q-card>
        <q-card-section>
            <div class="text-h6">{{ report.name }}</div>
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

import dateMixin from "@/mixins/dateMixin";

export default defineComponent({
    name: "Overview Card",

    mixins: [dateMixin],

    props: {
        report: Object,
        reportId: String,
    },
});
</script>

<style scoped>
.q-card {
    width: 100%;
}
</style>
