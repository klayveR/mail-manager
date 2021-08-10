<template>
    <q-btn dense round flat icon="info" color="primary" @click="start" :loading="task.working" :disabled="task.working">
        <q-tooltip ref="tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]"> Informationen abrufen </q-tooltip>
    </q-btn>
</template>

<script>
import { defineComponent } from "vue";

import taskMixin from "@/mixins/taskMixin";

export default defineComponent({
    name: "Get Information Button",

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
                channel: "GET_INFORMATION",
                name: `Informationen abrufen`,
                title: `Informationen von ${this.account.user} abrufen`,
                createReportOnSuccess: true,
                createReportOnFail: true,
            });

            if (started) {
                this.$refs.tooltip.hide();
            }
        },
    },
});
</script>
