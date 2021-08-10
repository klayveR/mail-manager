<template>
    <q-icon :size="size" :name="iconName" :class="textClass" />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "Boolean Icon",

    props: {
        enabled: Boolean,
        size: String,
        iconTrue: String,
        iconFalse: String,
    },

    computed: {
        textClass() {
            return this.enabled ? "text-positive" : "text-negative";
        },
        iconName() {
            return this.enabled ? this.iconTrue : this.iconFalse;
        },
    },
});
</script>
