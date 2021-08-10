<template>
    <span class="cursor-pointer" :class="{ blurred }" @click="toggleBlur">
        <slot />
    </span>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            blurred: true,
        };
    },
    methods: {
        toggleBlur() {
            this.blurred = !this.blurred;
        },
    },
});
</script>

<style lang="scss" scoped>
.blurred {
    color: transparent;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    user-select: none;
}
</style>
