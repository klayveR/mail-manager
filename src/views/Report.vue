<template>
    <q-page class="q-pa-md" v-if="report != null">
        <div class="row q-gutter-md">
            <div class="col">
                <OverviewCard :report="report" />
            </div>
            <div class="col" v-if="report.data != null && report.data.account != null">
                <AccountCard :account="report.data.account" :host="report.data.host" />
            </div>
        </div>
        <div class="row q-mt-md" v-if="report.data != null && report.data.quota != null && report.data.quota !== false">
            <div class="col">
                <QuotaCard :data="report.data.quota" />
            </div>
        </div>
        <div class="row q-mt-md" v-if="report.data != null && report.data.mailboxes != null && report.data.mailboxes.length > 0">
            <div class="col">
                <MailboxTable :data="report.data.mailboxes" />
            </div>
        </div>
        <div class="row q-mt-md" v-if="report.data != null && report.data.errors != null && report.data.errors.length > 0">
            <div class="col">
                <ErrorList :data="report" />
            </div>
        </div>
    </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import OverviewCard from "@/components/Reports/OverviewCard.vue";
import AccountCard from "@/components/Reports/AccountCard.vue";
import ErrorList from "@/components/Reports/ErrorList.vue";
import MailboxTable from "@/components/Reports/MailboxTable.vue";
import QuotaCard from "@/components/Reports/QuotaCard.vue";

export default defineComponent({
    name: "Report",

    components: {
        OverviewCard,
        AccountCard,
        ErrorList,
        MailboxTable,
        QuotaCard,
    },

    computed: {
        ...mapState("reports", {
            reports: (state) => state.items,
        }),
        ...mapGetters("reports", {
            existsReportId: "existsId",
        }),
    },

    data() {
        return {
            report: undefined,
        };
    },

    async activated() {
        const id = this.$route.params.id;

        if (this.existsReportId(id)) {
            this.report = this.reports[id];

            if (!this.report.read) {
                const result = await this.$store.dispatch("reports/markAsRead", id);
                if (!result.success) {
                    result.showNotification();
                }
            }
        } else {
            this.$router.push({ name: "reports" });
            return;
        }
    },
});
</script>

<style scoped></style>
