<template>
    <q-btn dense round flat icon="network_check" color="primary" @click="start" :loading="task.working" :disabled="task.working">
        <q-tooltip ref="tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]"> Verbindung testen </q-tooltip>
    </q-btn>
</template>

<script>
import { defineComponent } from "vue";

import taskMixin from "@/mixins/taskMixin";

export default defineComponent({
    name: "Test Connection Button",

    mixins: [taskMixin],

    props: {
        account: Object,
        host: Object,
    },

    methods: {
        start() {
            const started = this.startTask({
                data: {
                    account: { ...this.account },
                    host: { ...this.host },
                },
                channel: "TEST_CONNECTION",
                name: `Verbindung testen`,
                title: `Verbindung zu ${this.account.user} testen`,
                createReportOnFail: true,
            });

            if (started) {
                this.$refs.tooltip.hide();
            }
        },
    },
});
</script>
