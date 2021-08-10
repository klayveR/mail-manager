<template>
    <q-linear-progress stripe rounded size="24px" :value="value" :color="color">
        <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="primary" :label="label" />
        </div>
    </q-linear-progress>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "Quota Progressbar",

    props: {
        data: Object,
        useNumbers: Boolean,
        name: String,
    },

    computed: {
        color() {
            if (this.value >= 0.9) {
                return "negative";
            }

            if (this.value >= 0.7) {
                return "warning";
            }

            return "positive";
        },
        value() {
            if (this.data.usage != null && this.data.limit != null) {
                return this.data.usage / this.data.limit;
            }

            return 0;
        },
        label() {
            let status = ``;
            if (this.useNumbers & (this.data.usage != null) && this.data.limit != null) {
                status += `${this.data.usage} / ${this.data.limit}`;
            } else if (this.data.status != null) {
                status += this.data.status;
            } else {
                status += `${(this.value * 100).toFixed(0)}%`;
            }

            let label = status;
            if (this.name != null) {
                label = `${this.name}: ${label}`;
            }

            return label;
        },
    },
});
</script>
