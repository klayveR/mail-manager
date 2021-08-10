<template>
    <q-page>
        <div class="row">
            <div class="col q-pa-md">
                <ReportTable :rows="reports" />
            </div>
        </div>
    </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import ReportTable from "@/components/Reports/ReportTable.vue";

export default defineComponent({
    name: "Reports",

    components: {
        ReportTable,
    },

    computed: {
        ...mapGetters({
            reports: "reports/getAsArray",
        }),
    },
});
</script>

<style scoped></style>
